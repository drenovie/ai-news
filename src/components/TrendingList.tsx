import { Link } from "react-router-dom";
import { Article } from "@/lib/types";
import { useClubsContext } from "@/contexts/ClubsContext";
import { format } from "date-fns";

const numberColors = ["text-italia-green", "text-italia-red", "text-italia-green", "text-italia-red"];

interface TrendingListProps {
  articles: Article[];
}

export function TrendingList({ articles }: TrendingListProps) {
  const { getClubById } = useClubsContext();

  return (
    <div>
      <h3 className="text-xs font-nav font-bold uppercase tracking-[0.15em] text-italia-red mb-4 pb-2 border-b-2 border-italia-red">
        Trending
      </h3>
      <div className="flex flex-col">
        {articles.map((article, i) => {
          const clubData = article.clubIds.map((id) => getClubById(id)).filter(Boolean);
          return (
            <Link
              key={article.id}
              to={`/article/${article.slug}`}
              className="group flex gap-4 py-4 border-b border-border last:border-0"
            >
              <span className={`text-3xl font-heading font-bold shrink-0 w-8 leading-none pt-1 opacity-60 ${numberColors[i % numberColors.length]}`}>
                {String(i + 1).padStart(2, "0")}
              </span>
              <div className="min-w-0">
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
                <h4 className="font-heading font-semibold text-sm leading-snug text-foreground group-hover:text-italia-red transition-colors line-clamp-2">
                  {article.title}
                </h4>
                <div className="flex items-center gap-2 mt-1 text-[11px] text-muted-foreground">
                  <span className="font-semibold text-italia-green">{article.source}</span>
                  <span className="text-italia-red">·</span>
                  <time>{format(new Date(article.publishedAt), "MMM d, yyyy")}</time>
                </div>
              </div>
            </Link>
          );
        })}
      </div>
    </div>
  );
}
