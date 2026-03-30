export interface Article {
  id: string;
  slug: string;
  title: string;
  snippet: string;
  content: string;
  source: string;
  sourceUrl: string;
  sourceItemUrl?: string;
  imageUrl: string;
  publishedAt: string;
  guid?: string;
}

export interface Video {
  id: string;
  video_id: string;
  slug: string;
  title: string;
  description: string;
  thumbnail_url: string;
  published_at: string;
  channelName?: string;
  channel_id: string;
}
