import { Link } from "wouter";
import { Sparkles } from "lucide-react";
import { ThemeToggle } from "./theme-toggle";
import { Badge } from "@/components/ui/badge";

export function Header() {
  return (
    <header className="sticky top-0 z-50 border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex h-16 items-center justify-between gap-4">
          <Link href="/" data-testid="link-home">
            <div className="flex items-center gap-3">
              <div className="flex h-9 w-9 items-center justify-center rounded-md bg-primary">
                <Sparkles className="h-5 w-5 text-primary-foreground" />
              </div>
              <div className="flex flex-col">
                <span className="text-lg font-bold leading-tight">AI Blog</span>
                <span className="text-xs text-muted-foreground leading-tight">
                  Daily AI-Generated Content
                </span>
              </div>
            </div>
          </Link>
          <div className="flex items-center gap-3 flex-wrap">
            <Badge variant="outline" className="hidden sm:flex gap-1.5 no-default-hover-elevate">
              <span className="relative flex h-2 w-2">
                <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-green-400 opacity-75"></span>
                <span className="relative inline-flex h-2 w-2 rounded-full bg-green-500"></span>
              </span>
              <span>Auto-updating daily</span>
            </Badge>
            <ThemeToggle />
          </div>
        </div>
      </div>
    </header>
  );
}
