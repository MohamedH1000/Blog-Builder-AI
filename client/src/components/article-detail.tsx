import { Link } from "wouter";
import { Calendar, Clock, ArrowLeft, Sparkles } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import type { Article } from "@shared/schema";
import { formatDistanceToNow, format } from "date-fns";

interface ArticleDetailProps {
  article: Article | undefined;
  isLoading: boolean;
  error: Error | null;
}

export function ArticleDetail({
  article,
  isLoading,
  error,
}: ArticleDetailProps) {
  if (isLoading) {
    return <ArticleDetailSkeleton />;
  }

  if (error || !article) {
    return (
      <div className="flex flex-col items-center justify-center py-16 px-4 text-center">
        <h3 className="text-lg font-semibold mb-2">Article not found</h3>
        <p className="text-muted-foreground max-w-md mb-6">
          The article you're looking for doesn't exist or has been removed.
        </p>
        <Link href="/">
          <Button data-testid="button-back-home">
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to articles
          </Button>
        </Link>
      </div>
    );
  }

  const formattedDate = format(new Date(article.createdAt), "MMMM d, yyyy");
  const timeAgo = formatDistanceToNow(new Date(article.createdAt), {
    addSuffix: true,
  });

  return (
    <article className="py-8 md:py-12">
      <div className="mx-auto max-w-3xl px-4 sm:px-6">
        <Link href="/" data-testid="link-back">
          <Button variant="ghost" className="mb-6 -ml-2">
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to articles
          </Button>
        </Link>

        <header className="mb-8">
          <div className="flex flex-wrap items-center gap-3 text-sm text-muted-foreground mb-4">
            <Badge variant="secondary" className="text-xs font-medium no-default-hover-elevate">
              {article.topic}
            </Badge>
            <span className="flex items-center gap-1.5">
              <Calendar className="h-4 w-4" />
              <time dateTime={article.createdAt.toString()} title={timeAgo}>
                {formattedDate}
              </time>
            </span>
            <span className="flex items-center gap-1.5">
              <Clock className="h-4 w-4" />
              <span>{article.readingTime} min read</span>
            </span>
          </div>

          <h1
            className="text-3xl md:text-4xl lg:text-5xl font-bold leading-tight tracking-tight font-serif mb-6"
            data-testid="text-article-title"
          >
            {article.title}
          </h1>

          <p className="text-lg md:text-xl text-muted-foreground leading-relaxed">
            {article.excerpt}
          </p>
        </header>

        <div className="h-px bg-border mb-8" />

        <div
          className="prose prose-lg dark:prose-invert max-w-none font-serif"
          data-testid="text-article-content"
        >
          {article.content.split("\n\n").map((paragraph, index) => {
            if (paragraph.startsWith("# ")) {
              return (
                <h2
                  key={index}
                  className="text-2xl md:text-3xl font-bold mt-8 mb-4 font-serif"
                >
                  {paragraph.replace("# ", "")}
                </h2>
              );
            }
            if (paragraph.startsWith("## ")) {
              return (
                <h3
                  key={index}
                  className="text-xl md:text-2xl font-semibold mt-6 mb-3 font-serif"
                >
                  {paragraph.replace("## ", "")}
                </h3>
              );
            }
            if (paragraph.startsWith("> ")) {
              return (
                <blockquote
                  key={index}
                  className="border-l-4 border-primary pl-4 italic my-6 text-muted-foreground"
                >
                  {paragraph.replace("> ", "")}
                </blockquote>
              );
            }
            return (
              <p key={index} className="mb-6 leading-relaxed text-foreground/90">
                {paragraph}
              </p>
            );
          })}
        </div>

        <div className="h-px bg-border my-8" />

        <footer className="flex items-center justify-between gap-4 flex-wrap">
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <Sparkles className="h-4 w-4" />
            <span>AI-generated content</span>
          </div>
          <Link href="/">
            <Button variant="outline" data-testid="button-view-all">
              View all articles
            </Button>
          </Link>
        </footer>
      </div>
    </article>
  );
}

function ArticleDetailSkeleton() {
  return (
    <div className="py-8 md:py-12">
      <div className="mx-auto max-w-3xl px-4 sm:px-6">
        <Skeleton className="h-9 w-36 mb-6" />

        <div className="mb-8">
          <div className="flex items-center gap-3 mb-4">
            <Skeleton className="h-5 w-20" />
            <Skeleton className="h-4 w-28" />
            <Skeleton className="h-4 w-24" />
          </div>
          <Skeleton className="h-12 w-full mb-2" />
          <Skeleton className="h-12 w-4/5 mb-6" />
          <Skeleton className="h-6 w-full" />
          <Skeleton className="h-6 w-3/4 mt-2" />
        </div>

        <Skeleton className="h-px w-full mb-8" />

        <div className="space-y-4">
          {Array.from({ length: 8 }).map((_, i) => (
            <Skeleton key={i} className="h-5 w-full" />
          ))}
        </div>
      </div>
    </div>
  );
}
