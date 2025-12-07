import { useQuery } from "@tanstack/react-query";
import { useParams } from "wouter";
import { Layout } from "@/components/layout";
import { ArticleDetail } from "@/components/article-detail";
import type { Article } from "@shared/schema";

export default function ArticlePage() {
  const params = useParams<{ id: string }>();
  const articleId = params.id;

  const {
    data: article,
    isLoading,
    error,
  } = useQuery<Article>({
    queryKey: ["/api/articles", articleId],
    enabled: !!articleId,
  });

  return (
    <Layout>
      <ArticleDetail article={article} isLoading={isLoading} error={error} />
    </Layout>
  );
}
