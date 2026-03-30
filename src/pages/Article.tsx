import { useParams, Link } from "react-router-dom";
import { Footer } from "@/components/Footer";
import DOMPurify from "dompurify";
import { useMemo } from "react";
import { SEOHead } from "@/components/SEOHead";
import { Header } from "@/components/Header";
import { ShareSidebar } from "@/components/ShareSidebar";
import { ArticleCard } from "@/components/ArticleCard";
import { useArticles, useArticleBySlug } from "@/hooks/use-articles";
import { ArrowLeft, Loader2, Calendar, Clock, ExternalLink } from "lucide-react";
import { format } from "date-fns";

const ArticlePage = () => {
  const { slug } = useParams<{ slug: string }>();
  const { data: article, isLoading, isError, error } = useArticleBySlug(slug);
  const { data: articlesData } = useArticles();
  
  const allArticles = articlesData?.pages.flat() ?? [];

  const cleanedContent = useMemo(() => {
    if (!article?.content) return "";
    const html = article.content;
    // Remove leading image if it matches hero image
    const contentWithoutLeadingImg = html.replace(/^\s*<img[^>]*>\s*/i, "");
    
    // If it looks like plain text (no HTML tags), wrap it in paragraphs
    if (!contentWithoutLeadingImg.includes('<')) {
      return contentWithoutLeadingImg
        .split('\n\n')
        .map(p => `<p>${p.replace(/\n/g, '<br/>')}</p>`)
        .join('');
    }
    
    return contentWithoutLeadingImg;
  }, [article?.content]);

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background">
        <Header />
        <div className="container py-32 flex justify-center">
          <Loader2 className="h-10 w-10 animate-spin text-primary" />
        </div>
      </div>
    );
  }

  if (isError || !article) {
    return (
      <div className="min-h-screen bg-background">
        <Header />
        <div className="container py-32 text-center space-y-4">
          <h1 className="text-4xl font-black text-bark-900 uppercase">Article not found</h1>
          <p className="text-muted-foreground font-medium">The content you're looking for might have been moved or deleted.</p>
          <Link to="/" className="inline-block bg-primary text-white px-8 py-3 rounded-xl font-bold uppercase tracking-widest text-xs hover:scale-105 transition-transform">Back to Intelligence</Link>
        </div>
        <Footer />
      </div>
    );
  }

  const relatedArticles = allArticles
    .filter((a) => a.id !== article.id && a.source === article.source)
    .slice(0, 3);

  const nextArticles = allArticles
    .filter((a) => a.id !== article.id && a.source !== article.source)
    .slice(0, 3);

  const shareUrl = typeof window !== "undefined" ? window.location.href : "";

  return (
    <div className="min-h-screen bg-background flex flex-col items-center">
      <SEOHead
        title={article.title}
        description={article.snippet}
        image={article.imageUrl}
        url={`${window.location.origin}/article/${article.slug}`}
        type="article"
        publishedAt={article.publishedAt}
        author={article.source}
      />
      <Header />

      <main className="w-full max-w-[1920px] mx-auto px-global py-12">
        <div className="max-w-5xl mx-auto">
          <Link to="/" className="inline-flex items-center gap-2 text-[10px] font-black uppercase tracking-[0.2em] text-muted-foreground hover:text-primary transition-colors mb-12">
            <ArrowLeft className="h-3 w-3" /> Back to feed
          </Link>

          <div className="flex flex-col lg:flex-row gap-16">
            {/* Sidebar */}
            <aside className="hidden lg:block w-12 shrink-0">
              <div className="sticky top-32">
                <ShareSidebar url={shareUrl} title={article.title} />
              </div>
            </aside>

            {/* Content */}
            <article className="flex-1 min-w-0">
              <header className="space-y-6 mb-12">
                <div className="flex items-center gap-3">
                  <a 
                    href={article.sourceItemUrl || article.sourceUrl} 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="source-badge text-xs px-3 py-1 hover:bg-primary hover:text-white transition-colors"
                  >
                    {article.source}
                  </a>
                  {article.sourceUrl && (
                    <a 
                      href={article.sourceUrl} 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="text-[10px] font-black uppercase tracking-[0.1em] text-primary hover:text-bark-900 transition-colors flex items-center gap-1"
                    >
                      Source <ExternalLink className="w-2.5 h-2.5" />
                    </a>
                  )}
                  <div className="h-px w-8 bg-bark-200" />
                  <div className="flex items-center gap-4 text-[10px] font-black uppercase tracking-widest text-bark-700/60">
                    <span className="flex items-center gap-1.5"><Calendar className="w-3 h-3" /> {format(new Date(article.publishedAt), "MMM d, yyyy")}</span>
                    <span className="flex items-center gap-1.5"><Clock className="w-3 h-3" /> 4 min read</span>
                  </div>
                </div>

                <h1 className="text-3xl md:text-5xl font-black text-bark-900 leading-[1.1] tracking-tight uppercase">
                  {article.title}
                </h1>
              </header>

              <div className="lg:hidden mb-8 p-4 bg-sand-50 rounded-2xl border border-bark-200">
                <ShareSidebar url={shareUrl} title={article.title} />
              </div>

              <div className="aspect-[21/9] overflow-hidden rounded-3xl border border-bark-200 bg-sand-100 mb-12">
                <img src={article.imageUrl} alt={article.title} className="w-full h-full object-cover" />
              </div>

              <div
                className="prose prose-bark max-w-none mb-20 
                text-bark-900 leading-[1.8] font-medium
                prose-headings:uppercase prose-headings:font-black prose-headings:tracking-tight
                prose-a:text-primary prose-a:no-underline hover:prose-a:underline
                prose-img:rounded-3xl prose-img:border prose-img:border-bark-200
                prose-p:whitespace-pre-wrap
                [&_p]:mb-6 [&_h2]:text-2xl [&_h2]:mt-12 [&_h2]:mb-6
                "
                dangerouslySetInnerHTML={{ 
                  __html: DOMPurify.sanitize(cleanedContent) 
                }}
              />

              {article.sourceUrl && (
                <div className="mb-12 p-8 bg-sand-100 rounded-3xl border border-bark-200 flex flex-col items-center text-center gap-4">
                  <h4 className="text-sm font-black uppercase tracking-widest text-bark-900">Want to read more?</h4>
                  <p className="text-xs text-bark-700 font-medium max-w-md">This article was originally published on {article.source}. Visit the source to read the full coverage.</p>
                  <div className="flex flex-wrap justify-center gap-4 mt-2">
                    {article.sourceItemUrl && (
                      <a 
                        href={article.sourceItemUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-2 bg-bark-900 text-white px-8 py-3 rounded-xl font-bold uppercase tracking-widest text-xs hover:scale-105 transition-transform"
                      >
                        View on {article.source} <ExternalLink className="w-3.5 h-3.5" />
                      </a>
                    )}
                    <a 
                      href={article.sourceUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-2 bg-primary text-white px-8 py-3 rounded-xl font-bold uppercase tracking-widest text-xs hover:scale-105 transition-transform shadow-lg shadow-primary/20"
                    >
                      Original Content <ExternalLink className="w-3.5 h-3.5" />
                    </a>
                  </div>
                </div>
              )}

              {/* Related/Next Sections */}
              <footer className="pt-16 border-t border-bark-200 space-y-20">
                {relatedArticles.length > 0 && (
                  <section>
                    <h3 className="text-xs font-black uppercase tracking-[0.3em] text-bark-700 mb-8 flex items-center gap-4">
                      More from {article.source} <div className="h-px flex-1 bg-bark-200" />
                    </h3>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                      {relatedArticles.map((a) => (
                        <ArticleCard key={a.id} article={a} variant="grid" />
                      ))}
                    </div>
                  </section>
                )}

                {nextArticles.length > 0 && (
                  <section>
                    <h3 className="text-xs font-black uppercase tracking-[0.3em] text-primary mb-8 flex items-center gap-4">
                      Continue Reading <div className="h-px flex-1 bg-primary/20" />
                    </h3>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                      {nextArticles.map((a) => (
                        <ArticleCard key={a.id} article={a} variant="grid" />
                      ))}
                    </div>
                  </section>
                )}
              </footer>
            </article>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default ArticlePage;
