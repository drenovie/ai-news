export interface Club {
  id: string;
  name: string;
  shortName: string;
  logo: string;
  league: "serie_a" | "serie_b";
  city: string;
  color: string; // unique HSL color string e.g. "0 84% 50%"
}

export interface Article {
  id: string;
  slug: string;
  title: string;
  snippet: string;
  content: string;
  source: string;
  sourceUrl: string;
  imageUrl: string;
  publishedAt: string;
  clubIds: string[];
}
