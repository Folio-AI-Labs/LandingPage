export type HelpBlock =
  | { type: 'p'; html: string }
  | { type: 'h2'; text: string }
  | { type: 'ul'; items: string[] }
  | { type: 'media'; caption: string; kind?: 'image' | 'video' };

export interface HelpPageContent {
  title: string;
  description: string;
  blocks: HelpBlock[];
}
