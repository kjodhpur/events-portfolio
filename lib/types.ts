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
  event_media: Media[];
  event_links: LinkItem[];
};
