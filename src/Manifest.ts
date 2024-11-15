import {Post, Stream, Info, EpisodeLink, Catalog} from './utils/types';
import {netflixMirror} from './providers/netflixMirror';
import {autoEmbed} from './providers/autoEmbed';
import {moviesDrive} from './providers/drive';
import {moviesApi} from './providers/moviesApi';
export interface ProviderType {
    searchFilter?: string;
    catalog: Catalog[];
    genres: Catalog[];
    blurImage?: boolean;
    nonStreamableServer?: string[];
    nonDownloadableServer?: string[];
    GetStream: (
      id: string,
      type: string,
    ) => Promise<Stream[]>;
    GetHomePosts: (
      filter: string,
      page: number,
      provider: string,
      signal: AbortSignal,
    ) => Promise<Post[]>;
    GetEpisodeLinks?: (url: string) => Promise<EpisodeLink[]>;
    GetMetaData: (link: string, provider: string) => Promise<Info>;
    GetSearchPosts: (
      searchQuery: string,
      page: number,
      provider: string,
      signal: AbortSignal,
    ) => Promise<Post[]>;
  }
  export interface Manifest {
    [key: string]: ProviderType;
  }
  export const manifest: Manifest = {
    netflixMirror: netflixMirror,
    autoEmbed: autoEmbed,
    moviesDrive: moviesDrive,
    moviesApi: moviesApi
  };
  