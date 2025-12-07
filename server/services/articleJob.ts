import cron from "node-cron";
import { storage } from "../storage";
import { generateArticle, generateInitialArticles } from "./aiClient";

let isInitialized = false;

export async function initializeArticles(): Promise<void> {
  if (isInitialized) {
    console.log("[ArticleJob] Already initialized, skipping...");
    return;
  }

  try {
    const count = await storage.getArticleCount();
    console.log(`[ArticleJob] Current article count: ${count}`);

    if (count === 0) {
      console.log("[ArticleJob] No articles found, generating initial articles...");
      const articles = await generateInitialArticles();
      
      for (const article of articles) {
        await storage.createArticle(article);
        console.log(`[ArticleJob] Created article: ${article.title}`);
      }
      
      console.log(`[ArticleJob] Successfully created ${articles.length} initial articles`);
    } else {
      console.log("[ArticleJob] Articles already exist, skipping initialization");
    }

    isInitialized = true;
  } catch (error) {
    console.error("[ArticleJob] Error initializing articles:", error);
    throw error;
  }
}

export async function generateDailyArticle(): Promise<void> {
  try {
    console.log("[ArticleJob] Generating daily article...");
    const article = await generateArticle();
    await storage.createArticle(article);
    console.log(`[ArticleJob] Successfully created daily article: ${article.title}`);
  } catch (error) {
    console.error("[ArticleJob] Error generating daily article:", error);
  }
}

export function startArticleScheduler(): void {
  cron.schedule("0 0 * * *", async () => {
    console.log("[ArticleJob] Running daily article generation job...");
    await generateDailyArticle();
  });

  console.log("[ArticleJob] Scheduler started - will generate new article daily at midnight");
}
