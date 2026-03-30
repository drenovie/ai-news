import { Article } from "@/lib/types";
import { Link } from "react-router-dom";
import { formatDate } from "@/lib/utils";
import { cn } from "@/lib/utils";

interface ArticleCardProps {
  article: Article;
  variant?: "hero" | "grid" | "list" | "compact";
  className?: string;
  index?: number;
}

export function ArticleCard({ article, variant = "grid", className, index = 0 }: ArticleCardProps) {
  if (variant === "hero") {
    return (
      <Link 
        to={`/article/${article.slug}`}
        className={cn("group relative block aspect-[16/9] md:aspect-[21/9] overflow-hidden rounded-3xl bg-sand-100 border border-bark-200", className)}
      >
        <img 
          src={article.imageUrl} 
          alt={article.title}
          className="absolute inset-0 h-full w-full object-cover transition-transform duration-700 group-hover:scale-105"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-bark-900/90 via-bark-900/40 to-transparent" />
        <div className="absolute bottom-0 left-0 p-6 md:p-10 w-full max-w-3xl text-left">
          <div className="flex items-center gap-2 mb-3">
            <span className="source-badge bg-primary text-white border-none">{article.source}</span>
            <span className="text-[10px] font-bold text-white/70 tracking-widest uppercase">
              • {formatDate(article.publishedAt)}
            </span>
          </div>
          <h2 className="text-2xl md:text-4xl font-black text-white leading-tight mb-4 group-hover:text-sand-100 transition-colors uppercase tracking-tight">
            {article.title}
          </h2>
          <p className="text-sm md:text-base text-sand-100/80 line-clamp-2 font-medium max-w-2xl">
            {article.snippet}
          </p>
        </div>
      </Link>
    );
  }

  if (variant === "compact") {
    return (
      <Link 
        to={`/article/${article.slug}`}
        className={cn("group flex items-center gap-3 p-2 rounded-xl hover:bg-sand-50 transition-colors", className)}
      >
        <div className="shrink-0 w-20 h-14 rounded-lg overflow-hidden border border-bark-200/50">
          <img src={article.imageUrl} alt="" className="w-full h-full object-cover" />
        </div>
        <div className="flex-1 min-w-0">
          <h4 className="text-xs font-bold text-bark-900 line-clamp-2 leading-snug group-hover:text-primary transition-colors">
            {article.title}
          </h4>
          <p className="text-[9px] font-black uppercase tracking-widest text-primary mt-1">
            {article.source}
          </p>
        </div>
      </Link>
    );
  }

  if (variant === "list") {
    const isReversed = index % 2 === 1;
    return (
      <Link 
        to={`/article/${article.slug}`}
        className={cn(
          "group flex flex-col sm:flex-row gap-6 bg-sand-50/50 hover:bg-white rounded-3xl border border-bark-200 p-6 transition-all hover:shadow-xl hover:shadow-bark-900/5 hover:-translate-y-1",
          isReversed && "sm:flex-row-reverse",
          className
        )}
      >
        <div className="shrink-0 w-full sm:w-64 h-40 overflow-hidden rounded-2xl border border-bark-200/50">
          <img src={article.imageUrl} alt="" className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110" />
        </div>
        <div className={cn("flex-1 flex flex-col justify-between", isReversed && "text-right sm:text-right")}>
          <div>
            <div className={cn("flex items-center gap-2 mb-3", isReversed && "sm:flex-row-reverse")}>
              <span className="source-badge">{article.source}</span>
              <span className="text-[10px] font-bold text-muted-foreground">• {formatDate(article.publishedAt)}</span>
            </div>
            <h3 className="text-xl font-bold text-bark-900 line-clamp-2 leading-tight group-hover:text-primary transition-colors uppercase tracking-tight">{article.title}</h3>
            <p className="text-sm text-bark-700 mt-3 line-clamp-2 font-medium leading-relaxed">{article.snippet}</p>
          </div>
          <div className={cn(
            "mt-4 flex items-center text-[10px] font-black uppercase tracking-widest text-primary opacity-0 group-hover:opacity-100 transition-opacity",
            isReversed && "sm:flex-row-reverse"
          )}>
            Read Full Article {isReversed ? "←" : "→"}
          </div>
        </div>
      </Link>
    );
  }

  return (
    <Link 
      to={`/article/${article.slug}`}
      className={cn("group block space-y-4 text-left", className)}
    >
      <div className="aspect-[16/10] overflow-hidden rounded-2xl border border-bark-200 bg-sand-100">
        <img 
          src={article.imageUrl} 
          alt={article.title}
          className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
        />
      </div>
      <div className="space-y-2">
        <div className="flex items-center gap-2">
          <span className="source-badge">{article.source}</span>
          <span className="text-[10px] font-bold text-muted-foreground uppercase tracking-tighter">
            {formatDate(article.publishedAt)}
          </span>
        </div>
        <h3 className="text-lg font-bold text-bark-900 leading-tight group-hover:text-primary transition-colors line-clamp-2 uppercase tracking-tight">
          {article.title}
        </h3>
        <p className="text-xs text-bark-700 line-clamp-2 leading-relaxed font-medium">
          {article.snippet}
        </p>
      </div>
    </Link>
  );
}
