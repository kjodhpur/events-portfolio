export type Media = {
  id: string;
  kind: "photo" | "video";
  storage_path: string | null;
  public_url: string | null;
  embed_url: string | null;
  sort: number;
};
export type LinkItem = {
  id: string;
  label: string;
  url: string;
  sort: number;
};
export type EventNote = {
  id: string;
  kind: "highlight" | "improvement";
  body: string;
  sort: number;
  media_ref?: number | null;   // 1-based index of the media tile this note points at
};
export type EventItem = {
  id: string;
  created_at: string;
  event_date: string | null;
  title: string;
  venue: string | null;
  role: string | null;
  scale: string | null;
  blurb: string | null;
  sort: number;
  published: boolean;
  category?: string | null;          // 'produced' | 'attended'
  scope?: string | null;             // 'Regional' | 'International' | 'University'
  event_media: Media[];
  event_links: LinkItem[];
  event_notes?: EventNote[];
};
