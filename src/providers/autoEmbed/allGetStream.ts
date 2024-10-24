import { Stream } from '../../utils/types';
import { getWhvxStream } from './getWhvxStream';
import { multiExtractor } from './multiExtractor';
import { stableExtractor } from './stableExtractor';
import { fileExtractor } from './fileExtractor';
import { getFlimxyStream } from './getFlimxyStream';
import { getRiveStream } from './getRiveStream';
import { getVidSrcRip } from './getVidSrcRip';
const autoembed = 'YXV0b2VtYmVkLmNj';
export const allGetStream = async (
  id: string,
  type: string,
): Promise<Stream[]> => {
  try {
    const streams: Stream[] = [];
    const { imdbId, season, episode, title, tmdbId, year } = JSON.parse(id);
    
    // Lấy dữ liệu từ các nguồn khác nhau song song
     const rivePromise = getRiveStream(tmdbId, episode, season, type, streams);
    
     const server1Url =
       type === 'movie'
         ? `https://${atob(autoembed)}/embed/oplayer.php?id=${imdbId}`
         : `https://${atob(
             autoembed,
           )}/embed/oplayer.php?id=${imdbId}&s=${season}&e=${episode}`;
     const multiPromise = multiExtractor(server1Url).then((links) => {
       links.forEach(({ lang, url }) => {
         streams.push({
           server: 'Multi' + (lang ? `-${lang}` : ''),
           link: url,
           type: 'm3u8',
           subtitles: [],
         });
       });
     });
    
   const server3Url =
       type === 'movie'
        ? `https://viet.${atob(autoembed)}/movie/${imdbId}`
         : `https://viet.${atob(autoembed)}/tv/${imdbId}/${season}/${episode}`;
     const stablePromise = stableExtractor(server3Url).then((links3) => {
       links3.forEach(({ lang, url }) => {
         streams.push({
           server: 'Viet ' + (lang ? `-${lang}` : ''),
           link: url,
           type: 'm3u8',
           subtitles: [],
         });
       });
     });

    const server4Url =
    type === 'movie'
      ? `https://2embed.wafflehacker.io/scrape?id=${imdbId}`
      : `https://2embed.wafflehacker.io/scrape?id=${imdbId}&s=${season}&e=${episode}`;
  const stable4Promise = fileExtractor(server4Url).then((links4) => {
    links4.forEach(({ lang, url }) => {
      streams.push({
        server: '2X ' + (lang ? `-${lang}` : ''),
        link: url,
        type: 'm3u8',
        subtitles: [],
      });
    });
  });
    // Sử dụng Promise.all để chạy song song các yêu cầu
    await Promise.all([rivePromise,multiPromise,server3Url,stable4Promise]);
    return streams;
  } catch (err) {
    console.error(err);
    return [];
  }
};
