import { useParams, Link } from "react-router-dom";
import { Footer } from "@/components/Footer";
import DOMPurify from "dompurify";
import { useMemo } from "react";
import { SEOHead } from "@/components/SEOHead";
import { Header } from "@/components/Header";
import { ShareSidebar } from "@/components/ShareSidebar";
import { CompactArticleCard } from "@/components/CompactArticleCard";
import { useArticles, useArticleBySlug } from "@/hooks/use-articles";
import { useClubsContext } from "@/contexts/ClubsContext";
import { ArrowLeft, ExternalLink, Share2, Loader2 } from "lucide-react";
import { getOptimizedImageUrl } from "@/lib/image-utils";
import { Button } from "@/components/ui/button";
import { format } from "date-fns";

const ArticlePage = () => {
  const { slug } = useParams<{ slug: string }>();
  const { data: article, isLoading, isError, error } = useArticleBySlug(slug);
  const { data: articlesData } = useArticles();
  const allArticles = articlesData?.pages.flat() ?? [];
  const { getClubById } = useClubsContext();

  const cleanedContent = useMemo(() => {
    const html = article?.content || "";
    return html.replace(/^\s*<img[^>]*>\s*/i, "");
  }, [article?.content]);

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background">
        <Header />
        <div className="container py-16 flex justify-center">
          <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
        </div>
      </div>
    );
  }

  if (isError) {
    return (
      <div className="min-h-screen bg-background">
        <Header />
        <div className="container py-16 text-center">
          <p className="text-destructive font-semibold mb-2">Could not load article</p>
          <p className="text-sm text-muted-foreground">{(error as Error)?.message || "Check console for details."}</p>
          <Link to="/" className="text-italia-green hover:underline mt-4 inline-block">Back to home</Link>
        </div>
      </div>
    );
  }

  if (!article) {
    return (
      <div className="min-h-screen bg-background">
        <Header />
        <div className="container py-16 text-center">
          <h1 className="text-2xl font-heading font-bold mb-2">Article not found</h1>
          <Link to="/" className="text-italia-green hover:underline">Back to home</Link>
        </div>
      </div>
    );
  }

  const sortedByRecency = [...allArticles].sort(
    (a, b) => new Date(b.publishedAt).getTime() - new Date(a.publishedAt).getTime()
  );

  const currentIndex = sortedByRecency.findIndex((a) => a.id === article.id);

  const nextArticles = sortedByRecency
    .filter((_, i) => i > currentIndex && i <= currentIndex + 3)
    .slice(0, 3);

  const relatedArticles = sortedByRecency
    .filter((a) => a.id !== article.id && a.clubIds.some((cid) => article.clubIds.includes(cid)))
    .slice(0, 4);

  const clubData = article.clubIds.map((id) => getClubById(id)).filter(Boolean);
  const shareUrl = typeof window !== "undefined" ? window.location.href : "";

  const snippet = article.snippet || article.title;

  return (
    <div className="min-h-screen bg-background">
      <SEOHead
        title={article.title}
        description={snippet}
        image={article.imageUrl}
        url={`${window.location.origin}/article/${article.slug}`}
        type="article"
        publishedAt={article.publishedAt}
        author={article.source}
      />
      <Header />

      <main className="container py-8">
        <Link to="/" className="inline-flex items-center gap-1.5 text-sm text-muted-foreground hover:text-italia-green mb-8">
          <ArrowLeft className="h-4 w-4" /> Back to news
        </Link>

        <div className="flex flex-col lg:flex-row gap-8">
          <div className="hidden lg:block">
            <ShareSidebar url={shareUrl} title={article.title} />
          </div>

          <article className="max-w-[720px] mx-auto flex-1">
            {/* Club pill tags */}
            {clubData.length > 0 && (
              <div className="flex flex-wrap gap-2 mb-4">
                {clubData.map((c) => (
                  <Link
                    key={c!.id}
                    to={`/?club=${c!.id}`}
                    className="inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-xs font-bold text-white hover:opacity-80 transition-opacity"
                    style={{ backgroundColor: `hsl(${c!.color})` }}
                  >
                    <span className="w-2 h-2 rounded-full bg-white/30 shrink-0" />
                    {c!.shortName}
                  </Link>
                ))}
              </div>
            )}

            <h1 className="font-heading font-bold text-2xl md:text-3xl lg:text-4xl leading-tight text-foreground mb-4">
              {article.title}
            </h1>

            <div className="flex items-center gap-3 text-sm text-muted-foreground mb-4 pb-4 border-b-2 border-italia-green">
              <span className="font-semibold text-italia-red">{article.source}</span>
              <span className="text-italia-green">·</span>
              <time>{format(new Date(article.publishedAt), "MMMM d, yyyy")}</time>
              <span className="text-italia-red">·</span>
              <span>3 min read</span>
            </div>

            <div className="lg:hidden mb-6">
              <ShareSidebar url={shareUrl} title={article.title} />
            </div>

            <div className="aspect-video overflow-hidden rounded-sm bg-muted mb-8">
              <img src={getOptimizedImageUrl(article.imageUrl, 800, 450)} alt={article.title} className="w-full h-full object-cover" />
            </div>

            <div
              className="prose prose-lg max-w-none mb-10 text-foreground [&_img]:rounded-sm [&_img]:my-4 [&_img]:!max-w-full [&_img]:!h-auto [&_a]:text-italia-green [&_a:hover]:underline [&_h2]:font-heading [&_h2]:text-xl [&_h2]:mt-8 [&_h2]:mb-4 [&_p]:leading-[1.8] [&_figure]:my-6"
              dangerouslySetInnerHTML={{ __html: DOMPurify.sanitize(cleanedContent, { ADD_TAGS: ["picture", "source"], ADD_ATTR: ["srcset", "sizes", "loading", "decoding"], FORBID_ATTR: ["style", "width", "height"] }) }}
            />

            <div className="border-t-2 border-italia-red pt-6 mb-10" />

            {relatedArticles.length > 0 && (
              <section className="mb-10">
                <h2 className="text-xs font-nav font-bold uppercase tracking-[0.15em] text-italia-green mb-4 pb-2 border-b-2 border-italia-green">
                  Related Articles
                </h2>
                {relatedArticles.map((a) => (
                  <CompactArticleCard key={a.id} article={a} />
                ))}
              </section>
            )}

            {nextArticles.length > 0 && (
              <section>
                <h2 className="text-xs font-nav font-bold uppercase tracking-[0.15em] text-italia-red mb-4 pb-2 border-b-2 border-italia-red">
                  Read Next
                </h2>
                {nextArticles.map((a) => (
                  <CompactArticleCard key={a.id} article={a} />
                ))}
              </section>
            )}
          </article>
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default ArticlePage;
