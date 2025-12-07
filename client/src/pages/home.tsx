import { useQuery } from "@tanstack/react-query";
import { Layout } from "@/components/layout";
import { ArticleList } from "@/components/article-list";
import { Sparkles } from "lucide-react";
import type { Article } from "@shared/schema";

export default function Home() {
  const {
    data: articles,
    isLoading,
    error,
    refetch,
  } = useQuery<Article[]>({
    queryKey: ["/api/articles"],
  });

  return (
    <Layout>
      <div className="py-8 md:py-12">
        <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
          <header className="mb-10 text-center">
            <div className="inline-flex items-center gap-2 text-primary mb-4">
              <Sparkles className="h-5 w-5" />
              <span className="text-sm font-medium uppercase tracking-wider">
                AI-Powered Blog
              </span>
            </div>
            <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold tracking-tight mb-4 font-serif">
              Fresh perspectives, daily
            </h1>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Discover thought-provoking articles on technology, science,
              culture, and more. New content generated automatically every day.
            </p>
          </header>

          <ArticleList
            articles={articles}
            isLoading={isLoading}
            error={error}
            onRetry={() => refetch()}
          />
        </div>
      </div>
    </Layout>
  );
}
