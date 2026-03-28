import { Link } from "react-router-dom";
import { Article } from "@/lib/types";
import { useClubsContext } from "@/contexts/ClubsContext";
import { stripHtmlToText } from "@/lib/html-utils";
import { format } from "date-fns";
import { getOptimizedImageUrl } from "@/lib/image-utils";

interface ListArticleCardProps {
  article: Article;
  showImage?: boolean;
  imageRight?: boolean;
}

export function ListArticleCard({ article, showImage = false, imageRight = false }: ListArticleCardProps) {
  const { getClubById } = useClubsContext();
  const clubData = article.clubIds.map((id) => getClubById(id)).filter(Boolean);

  return (
    <Link to={`/article/${article.slug}`} className="group block">
      <article className={`flex gap-5 py-6 border-b border-border ${imageRight ? "flex-row-reverse" : ""}`}>
        {showImage && (
          <div className="w-32 h-24 md:w-40 md:h-28 rounded-sm overflow-hidden bg-muted shrink-0">
            <img
              src={getOptimizedImageUrl(article.imageUrl, 320, 224)}
              alt={article.title}
              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
              loading="lazy"
            />
          </div>
        )}
        <div className="flex flex-col justify-center min-w-0 flex-1">
          <div className="flex flex-wrap gap-2 mb-1.5" onClick={(e) => e.preventDefault()}>
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
          <h3 className="font-heading font-bold text-base md:text-lg leading-snug text-foreground group-hover:text-italia-green transition-colors line-clamp-2 mb-1">
            {article.title}
          </h3>
          <p className="text-muted-foreground text-sm leading-relaxed line-clamp-2 mb-2 hidden md:block">
            {stripHtmlToText(article.content).slice(0, 120)}...
          </p>
          <div className="flex items-center gap-2 text-[11px] text-muted-foreground">
            <span className="font-semibold text-italia-red">{article.source}</span>
            <span className="text-italia-green">·</span>
            <time>{format(new Date(article.publishedAt), "MMM d, yyyy")}</time>
          </div>
        </div>
      </article>
    </Link>
  );
}
