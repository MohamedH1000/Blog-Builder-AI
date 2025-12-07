import { Link } from "wouter";
import { Layout } from "@/components/layout";
import { Button } from "@/components/ui/button";
import { FileQuestion, ArrowLeft } from "lucide-react";

export default function NotFound() {
  return (
    <Layout>
      <div className="flex flex-col items-center justify-center py-24 px-4 text-center">
        <div className="rounded-full bg-muted p-6 mb-6">
          <FileQuestion className="h-12 w-12 text-muted-foreground" />
        </div>
        <h1 className="text-3xl font-bold mb-3 font-serif">Page not found</h1>
        <p className="text-muted-foreground max-w-md mb-8">
          The page you're looking for doesn't exist or has been moved.
        </p>
        <Link href="/">
          <Button data-testid="button-go-home">
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to articles
          </Button>
        </Link>
      </div>
    </Layout>
  );
}
