import { Link } from "react-router-dom";
import { Article } from "@/lib/types";
import { useClubsContext } from "@/contexts/ClubsContext";
import { stripHtmlToText } from "@/lib/html-utils";
import { format } from "date-fns";
import { getOptimizedImageUrl } from "@/lib/image-utils";

interface HeroArticleCardProps {
  article: Article;
}

export function HeroArticleCard({ article }: HeroArticleCardProps) {
  const { getClubById } = useClubsContext();
  const clubData = article.clubIds.map((id) => getClubById(id)).filter(Boolean);

  return (
    <Link to={`/article/${article.slug}`} className="group block">
      <article>
        <div className="aspect-[16/9] max-h-[320px] overflow-hidden rounded-sm bg-muted mb-4 border-b-[3px] border-italia-green">
          <img
            src={getOptimizedImageUrl(article.imageUrl, 640, 360)}
            alt={article.title}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
            loading="lazy"
          />
        </div>
        <div className="flex flex-wrap gap-2 mb-2" onClick={(e) => e.preventDefault()}>
          {clubData.map((c) => (
            <Link
              key={c!.id}
              to={`/?club=${c!.id}`}
              className="club-tag-inline text-[11px] font-nav font-bold uppercase tracking-wider hover:opacity-70 transition-opacity"
              style={{ color: `hsl(${c!.color})`, '--club-tag-color': `hsl(${c!.color})` } as React.CSSProperties}
            >
              {c!.shortName}
            </Link>
          ))}
        </div>
        <h2 className="font-heading font-bold text-xl md:text-2xl lg:text-3xl leading-tight text-foreground group-hover:text-italia-green transition-colors mb-2">
          {article.title}
        </h2>
        <p className="text-muted-foreground text-sm leading-relaxed line-clamp-2 mb-3">
          {stripHtmlToText(article.content).slice(0, 160)}...
        </p>
        <div className="flex items-center gap-3 text-xs text-muted-foreground">
          <span className="font-semibold text-italia-red">{article.source}</span>
          <span className="text-italia-green">·</span>
          <time>{format(new Date(article.publishedAt), "MMM d, yyyy")}</time>
        </div>
      </article>
    </Link>
  );
}
