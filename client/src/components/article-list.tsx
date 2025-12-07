import { ArticleCard } from "./article-card";
import { ArticleCardSkeleton } from "./article-card-skeleton";
import { AlertCircle, FileText } from "lucide-react";
import { Button } from "@/components/ui/button";
import type { Article } from "@shared/schema";

interface ArticleListProps {
  articles: Article[] | undefined;
  isLoading: boolean;
  error: Error | null;
  onRetry?: () => void;
}

export function ArticleList({
  articles,
  isLoading,
  error,
  onRetry,
}: ArticleListProps) {
  if (isLoading) {
    return (
      <div className="grid gap-6 md:grid-cols-2">
        {Array.from({ length: 4 }).map((_, i) => (
          <ArticleCardSkeleton key={i} />
        ))}
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex flex-col items-center justify-center py-16 px-4 text-center">
        <div className="rounded-full bg-destructive/10 p-4 mb-4">
          <AlertCircle className="h-8 w-8 text-destructive" />
        </div>
        <h3 className="text-lg font-semibold mb-2">Unable to load articles</h3>
        <p className="text-muted-foreground max-w-md mb-6">
          We encountered an issue while fetching articles. Please try again.
        </p>
        {onRetry && (
          <Button onClick={onRetry} data-testid="button-retry">
            Try again
          </Button>
        )}
      </div>
    );
  }

  if (!articles || articles.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-16 px-4 text-center">
        <div className="rounded-full bg-muted p-4 mb-4">
          <FileText className="h-8 w-8 text-muted-foreground" />
        </div>
        <h3 className="text-lg font-semibold mb-2">No articles yet</h3>
        <p className="text-muted-foreground max-w-md">
          The first AI-generated article will appear soon. Check back shortly!
        </p>
      </div>
    );
  }

  return (
    <div className="grid gap-6 md:grid-cols-2" data-testid="article-list">
      {articles.map((article) => (
        <ArticleCard key={article.id} article={article} />
      ))}
    </div>
  );
}
