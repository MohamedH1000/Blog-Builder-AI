import { Link } from "wouter";
import { Calendar, Clock, ArrowRight } from "lucide-react";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import type { Article } from "@shared/schema";
import { formatDistanceToNow, format } from "date-fns";

interface ArticleCardProps {
  article: Article;
}

export function ArticleCard({ article }: ArticleCardProps) {
  const formattedDate = format(new Date(article.createdAt), "MMM d, yyyy");
  const timeAgo = formatDistanceToNow(new Date(article.createdAt), {
    addSuffix: true,
  });

  return (
    <Link href={`/article/${article.id}`} data-testid={`link-article-${article.id}`}>
      <Card className="group h-full transition-all duration-200 hover:border-primary/20 hover-elevate cursor-pointer">
        <CardHeader className="pb-3">
          <div className="flex flex-wrap items-center gap-2 text-sm text-muted-foreground mb-3">
            <Badge variant="secondary" className="text-xs font-medium no-default-hover-elevate">
              {article.topic}
            </Badge>
            <span className="flex items-center gap-1">
              <Calendar className="h-3.5 w-3.5" />
              <span title={formattedDate}>{timeAgo}</span>
            </span>
            <span className="flex items-center gap-1">
              <Clock className="h-3.5 w-3.5" />
              <span>{article.readingTime} min read</span>
            </span>
          </div>
          <h2 className="text-xl md:text-2xl font-bold leading-tight tracking-tight font-serif group-hover:text-primary transition-colors">
            {article.title}
          </h2>
        </CardHeader>
        <CardContent className="pt-0">
          <p className="text-muted-foreground leading-relaxed line-clamp-3 mb-4">
            {article.excerpt}
          </p>
          <div className="flex items-center gap-2 text-sm font-medium text-primary opacity-0 group-hover:opacity-100 transition-opacity">
            <span>Read article</span>
            <ArrowRight className="h-4 w-4" />
          </div>
        </CardContent>
      </Card>
    </Link>
  );
}
