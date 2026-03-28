import { Link } from "react-router-dom";
import { Article } from "@/lib/types";
import { useClubsContext } from "@/contexts/ClubsContext";
import { format } from "date-fns";
import { getOptimizedImageUrl } from "@/lib/image-utils";

interface ArticleCardProps {
  article: Article;
}

export function ArticleCard({ article }: ArticleCardProps) {
  const { getClubById } = useClubsContext();
  const clubData = article.clubIds
    .map((id) => getClubById(id))
    .filter(Boolean);

  return (
    <Link to={`/article/${article.slug}`} className="group block">
      <article className="bg-card rounded-lg border border-border overflow-hidden shadow-sm hover:shadow-md transition-shadow flex gap-3 p-3">
        {/* Compact thumbnail */}
        <div className="w-24 h-20 sm:w-28 sm:h-22 rounded-md overflow-hidden bg-muted shrink-0">
          <img
            src={getOptimizedImageUrl(article.imageUrl, 224, 160)}
            alt={article.title}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
            loading="lazy"
          />
        </div>

        <div className="flex flex-col flex-1 min-w-0">
          {/* Club tags with unique colors */}
          <div className="flex flex-wrap gap-1 mb-1" onClick={(e) => e.preventDefault()}>
            {clubData.map((c) => (
              <Link
                key={c!.id}
                to={`/?club=${c!.id}`}
                className="club-tag-inline text-[10px] font-heading font-bold uppercase tracking-wide px-1.5 py-0.5 rounded hover:opacity-80 transition-opacity"
                style={{
                  color: `hsl(${c!.color})`,
                  backgroundColor: `hsl(${c!.color} / 0.12)`,
                  '--club-tag-color': `hsl(${c!.color})`,
                } as React.CSSProperties}
              >
                {c!.shortName}
              </Link>
            ))}
          </div>

          {/* Title */}
          <h3 className="font-heading font-bold text-sm leading-snug text-card-foreground group-hover:text-primary transition-colors line-clamp-2">
            {article.title}
          </h3>

          {/* Meta */}
          <div className="flex items-center gap-2 mt-auto pt-1">
            <span className="text-[10px] font-semibold text-primary">{article.source}</span>
            <span className="text-[10px] text-muted-foreground">
              {format(new Date(article.publishedAt), "d MMM yyyy")}
            </span>
          </div>
        </div>
      </article>
    </Link>
  );
}
