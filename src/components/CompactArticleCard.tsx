import { Link } from "react-router-dom";
import { Article } from "@/lib/types";
import { useClubsContext } from "@/contexts/ClubsContext";
import { format } from "date-fns";
import { getOptimizedImageUrl } from "@/lib/image-utils";

interface CompactArticleCardProps {
  article: Article;
}

export function CompactArticleCard({ article }: CompactArticleCardProps) {
  const { getClubById } = useClubsContext();
  const clubData = article.clubIds.map((id) => getClubById(id)).filter(Boolean);

  return (
    <Link to={`/article/${article.slug}`} className="group block">
      <article className="flex gap-4 py-4 border-b border-border last:border-0">
        <div className="w-24 h-20 md:w-28 md:h-20 rounded-sm overflow-hidden bg-muted shrink-0">
          <img
            src={getOptimizedImageUrl(article.imageUrl, 224, 160)}
            alt={article.title}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
            loading="lazy"
          />
        </div>
        <div className="flex flex-col justify-center min-w-0">
          <div className="flex flex-wrap gap-2 mb-1" onClick={(e) => e.preventDefault()}>
            {clubData.map((c) => (
              <Link
                key={c!.id}
                to={`/?club=${c!.id}`}
                className="club-tag-inline text-[10px] font-nav font-bold uppercase tracking-wider hover:opacity-70 transition-opacity"
                style={{ color: `hsl(${c!.color})`, '--club-tag-color': `hsl(${c!.color})` } as React.CSSProperties}
              >
                {c!.shortName}
              </Link>
            ))}
          </div>
          <h3 className="font-heading font-semibold text-sm md:text-base leading-snug text-foreground group-hover:text-italia-green transition-colors line-clamp-2">
            {article.title}
          </h3>
          <div className="flex items-center gap-2 mt-1 text-[11px] text-muted-foreground">
            <span className="font-semibold text-italia-red">{article.source}</span>
            <span className="text-italia-green">·</span>
            <time>{format(new Date(article.publishedAt), "MMM d, yyyy")}</time>
          </div>
        </div>
      </article>
    </Link>
  );
}
