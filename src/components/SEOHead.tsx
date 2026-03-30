import { useEffect } from "react";

interface SEOHeadProps {
  title: string;
  description: string;
  image?: string;
  url?: string;
  type?: "article" | "video.other" | "website";
  publishedAt?: string;
  author?: string;
  /** For video pages: the YouTube video ID */
  videoId?: string;
  /** For video pages: thumbnail URL */
  thumbnailUrl?: string;
}

const SITE_NAME = "AI News";
const DEFAULT_IMAGE = "https://images.unsplash.com/photo-1677442136019-21780ecad995?w=1200&q=80";
const JSON_LD_ID = "seo-json-ld";

function setMeta(property: string, content: string, isName = false) {
  const attr = isName ? "name" : "property";
  let el = document.querySelector(`meta[${attr}="${property}"]`) as HTMLMetaElement | null;
  if (!el) {
    el = document.createElement("meta");
    el.setAttribute(attr, property);
    document.head.appendChild(el);
  }
  el.setAttribute("content", content);
}

function setJsonLd(data: Record<string, unknown> | null) {
  let script = document.getElementById(JSON_LD_ID) as HTMLScriptElement | null;
  if (!data) {
    script?.remove();
    return;
  }
  if (!script) {
    script = document.createElement("script");
    script.id = JSON_LD_ID;
    script.type = "application/ld+json";
    document.head.appendChild(script);
  }
  script.textContent = JSON.stringify(data);
}

export const SEOHead = ({
  title,
  description,
  image,
  url,
  type = "website",
  publishedAt,
  author,
  videoId,
  thumbnailUrl,
}: SEOHeadProps) => {
  useEffect(() => {
    const fullTitle = `${title} — ${SITE_NAME}`;
    const desc = description.slice(0, 160);
    const img = image || DEFAULT_IMAGE;
    const pageUrl = url || window.location.href;

    // Document title
    document.title = fullTitle;

    // Standard meta
    setMeta("description", desc, true);

    // Open Graph
    setMeta("og:title", fullTitle);
    setMeta("og:description", desc);
    setMeta("og:image", img);
    setMeta("og:url", pageUrl);
    setMeta("og:type", type);
    setMeta("og:site_name", SITE_NAME);

    // Twitter
    setMeta("twitter:card", "summary_large_image", true);
    setMeta("twitter:title", fullTitle, true);
    setMeta("twitter:description", desc, true);
    setMeta("twitter:image", img, true);

    // Article-specific
    if (type === "article" && publishedAt) {
      setMeta("article:published_time", publishedAt);
    }

    // Canonical
    let canonical = document.querySelector('link[rel="canonical"]') as HTMLLinkElement | null;
    if (!canonical) {
      canonical = document.createElement("link");
      canonical.setAttribute("rel", "canonical");
      document.head.appendChild(canonical);
    }
    canonical.setAttribute("href", pageUrl);

    // JSON-LD structured data
    if (type === "article") {
      setJsonLd({
        "@context": "https://schema.org",
        "@type": "NewsArticle",
        headline: title,
        description: desc,
        image: img,
        url: pageUrl,
        datePublished: publishedAt,
        author: {
          "@type": "Organization",
          name: author || SITE_NAME,
        },
        publisher: {
          "@type": "Organization",
          name: SITE_NAME,
          logo: {
            "@type": "ImageObject",
            url: DEFAULT_IMAGE,
          },
        },
        mainEntityOfPage: {
          "@type": "WebPage",
          "@id": pageUrl,
        },
      });
    } else if (type === "video.other" && videoId) {
      setJsonLd({
        "@context": "https://schema.org",
        "@type": "VideoObject",
        name: title,
        description: desc,
        thumbnailUrl: thumbnailUrl || img,
        uploadDate: publishedAt,
        contentUrl: `https://www.youtube.com/watch?v=${videoId}`,
        embedUrl: `https://www.youtube.com/embed/${videoId}`,
        publisher: {
          "@type": "Organization",
          name: SITE_NAME,
          logo: {
            "@type": "ImageObject",
            url: DEFAULT_IMAGE,
          },
        },
      });
    }

    // Cleanup: restore defaults on unmount
    return () => {
      document.title = `${SITE_NAME} — Videos & articles from top AI sources`;
      setMeta("description", "Stay updated with the latest in Artificial Intelligence. News, videos, and research from top sources.", true);
      setMeta("og:title", `${SITE_NAME} — Latest AI Updates`);
      setMeta("og:description", "Stay updated with the latest in Artificial Intelligence. News, videos, and research from top sources.");
      setMeta("og:image", DEFAULT_IMAGE);
      setMeta("og:type", "website");
      setJsonLd(null);
    };
  }, [title, description, image, url, type, publishedAt, author, videoId, thumbnailUrl]);

  return null;
};
