export abstract class Provider {
  abstract getSource(
    id: string,
    isMovie: boolean,
    season?: string,
    episode?: string
  ): Promise<Source | any>;
}
export interface Source {
  url: string;
  qualities?: { url: string; quality: string }[];
  referer: string;
  captions?: { url: string; language: string }[];
}
export type DecryptMethods = {
  [key: string]: (inputString: string) => string;
};

// getPosts
export interface Post {
  title: string;
  link: string;
  image: string;
  provider?: string;
}

// getStream
export interface Stream {
  server: string;
  link: string;
  type: string;
  quality?: '360' | '480' | '720' | '1080' | '2160';
  subtitles: string[];
  headers?: any;
}

// getInfo
export interface Info {
  id: string;
  title: string;
  image: string;
  synopsis: string;
  imdbId: string;
  type: string;
  tags?: string[];
  cast?: string[];
  rating?: string;
  linkList: Link[];
}
// getEpisodeLinks
export interface EpisodeLink {
  title: string;
  link: string;
}

export interface Link {
  id: string,
  title: string;
  quality?: string;
  episodesLink?: string;
  directLinks?: {
    title: string;
    link: string;
    type?: 'movie' | 'series';
  }[];
}

// catalog
export interface Catalog {
  title: string;
  filter: string;
}
