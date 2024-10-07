import { MovieMedia, ShowMedia } from '../utils/media';
import { UseableFetcher } from '../source/fetchers/types';

export type ScrapeContext = {
  proxiedFetcher: UseableFetcher;
  fetcher: UseableFetcher;
  progress(val: number): void;
};

export type EmbedInput = {
  url: string;
};

export type EmbedScrapeContext = EmbedInput & ScrapeContext;

export type MovieScrapeContext = ScrapeContext & {
  media: MovieMedia;
};

export type ShowScrapeContext = ScrapeContext & {
  media: ShowMedia;
};
