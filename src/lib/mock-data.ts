import { Article } from "./types";

function slugify(text: string): string {
  return text.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, "");
}

export const mockArticles: Article[] = [
  {
    id: "1",
    slug: slugify("OpenAI announces GPT-5 with unprecedented reasoning capabilities"),
    title: "OpenAI announces GPT-5 with unprecedented reasoning capabilities",
    snippet: "The new model promises to solve complex problems and exhibit human-level logic in various domains.",
    content: "OpenAI has officially unveiled GPT-5, their latest flagship model. Built on a new architecture, it demonstrates a massive leap in multi-step reasoning and factual accuracy. Developers can expect an expanded context window and significantly reduced latency.",
    source: "TechCrunch AI",
    sourceUrl: "https://techcrunch.com",
    imageUrl: "https://images.unsplash.com/photo-1677442136019-21780ecad995?w=800&q=80",
    publishedAt: "2026-03-28T14:30:00Z",
  },
  {
    id: "2",
    slug: slugify("Google DeepMind's Gemini 2.0 reaches SOTA on math benchmarks"),
    title: "Google DeepMind's Gemini 2.0 reaches SOTA on math benchmarks",
    snippet: "The latest update to Google's multimodal model shows incredible performance in scientific and mathematical tasks.",
    content: "Google DeepMind has released Gemini 2.0, which has achieved state-of-the-art results on several competitive mathematics and coding benchmarks. The model's ability to handle complex symbolic reasoning sets it apart from its predecessors.",
    source: "MIT Tech Review",
    sourceUrl: "https://technologyreview.com",
    imageUrl: "https://images.unsplash.com/photo-1620712943543-bcc4688e7485?w=800&q=80",
    publishedAt: "2026-03-28T11:00:00Z",
  },
];

export function getArticleBySlug(slug: string): Article | undefined {
  return mockArticles.find((a) => a.slug === slug);
}
