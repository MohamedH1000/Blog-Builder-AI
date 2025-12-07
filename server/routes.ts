import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { initializeArticles, startArticleScheduler } from "./services/articleJob";
import { generateArticle } from "./services/aiClient";

export async function registerRoutes(
  httpServer: Server,
  app: Express
): Promise<Server> {
  await initializeArticles();
  startArticleScheduler();

  app.get("/api/articles", async (_req, res) => {
    try {
      const articles = await storage.getAllArticles();
      res.json(articles);
    } catch (error) {
      console.error("[API] Error fetching articles:", error);
      res.status(500).json({ message: "Failed to fetch articles" });
    }
  });

  app.get("/api/articles/:id", async (req, res) => {
    try {
      const id = parseInt(req.params.id, 10);
      if (isNaN(id)) {
        return res.status(400).json({ message: "Invalid article ID" });
      }

      const article = await storage.getArticleById(id);
      if (!article) {
        return res.status(404).json({ message: "Article not found" });
      }

      res.json(article);
    } catch (error) {
      console.error("[API] Error fetching article:", error);
      res.status(500).json({ message: "Failed to fetch article" });
    }
  });

  app.post("/api/articles/generate", async (_req, res) => {
    try {
      console.log("[API] Generating new article on demand...");
      const articleData = await generateArticle();
      const article = await storage.createArticle(articleData);
      console.log(`[API] Successfully created article: ${article.title}`);
      res.status(201).json(article);
    } catch (error) {
      console.error("[API] Error generating article:", error);
      res.status(500).json({ message: "Failed to generate article" });
    }
  });

  return httpServer;
}
