import {Stream} from '../../utils/types';
import {getWhvxStream} from './getWhvxStream';
import {multiExtractor} from './multiExtractor';
import {stableExtractor} from './stableExtractor';
import {getFlimxyStream} from './getFlimxyStream';
import {getRiveStream} from './getRiveStream';
import {getVidSrcRip} from './getVidSrcRip';

const autoembed = 'YXV0b2VtYmVkLmNj';
export const allGetStream = async (
  id: string,
  type: string,
): Promise<Stream[]> => {
  try {
    // console.log(id);
    const streams: Stream[] = [];
    const {imdbId, season, episode, title, tmdbId, year} = JSON.parse(id);
    ///// whvx

    //  const whvxStream = await getWhvxStream(
    //    imdbId,
    //    tmdbId,
    //   season,
    //    episode,
    //    title,
    //    type,
    //    year,
    //    'nova',
    //    'aHR0cHM6Ly9hcGkud2h2eC5uZXQ=',
    //  );
    //  //whvx nova
    //  const subtitles: any = [];
    //  for (const caption in whvxStream?.captions) {
    //    subtitles.push({
    //      language: whvxStream?.captions?.[caption]?.language || 'Undefined',
    //      uri: whvxStream?.captions?.[caption]?.url,
    //      type: 'srt',
    //      title: whvxStream?.captions?.[caption]?.language || 'Undefined',
    //    });
    //  }
    //  for (const quality in whvxStream?.qualities) {
    //    streams.push({
    //      server: 'Nova-' + quality,
    //      link: whvxStream?.qualities?.[quality]?.url,
    //     type: whvxStream?.qualities?.[quality]?.type || 'mp4',
    //      subtitles: subtitles,
    //     quality: quality as any,
    //   });
    // }
     ///// rive
     //await getRiveStream(tmdbId, episode, season, type, streams);
     ///// vidsrcrip
     //await getVidSrcRip(tmdbId, season, episode, streams);
    ///// flimxy
    // const flimxyStream = await getFlimxyStream(imdbId, season, episode, type);
    // if (flimxyStream) {
    //    for (const quality in flimxyStream?.qualities) {
    //      streams.push({
    //        server: 'Flimxy-' + quality,
    //        link: flimxyStream?.qualities?.[quality]?.url,
    //        type: flimxyStream?.qualities?.[quality]?.type || 'mp4',
    //        quality: quality as any,
    //        subtitles: []
    //      });
    //    }
    // }
    const server1Url =
       type === 'movie'
         ? `https://${atob(autoembed)}/embed/oplayer.php?id=${imdbId}`
         : `https://${atob(
             autoembed,
           )}/embed/oplayer.php?id=${imdbId}&s=${season}&e=${episode}`;
     const links = await multiExtractor(server1Url);
     links.forEach(({lang, url}) => {
       streams.push({
         server: 'Multi' + (lang ? `-${lang}` : ''),
         link: url,
         type: 'm3u8',
         subtitles : []
       });
     });
     const server3Url =
       type === 'movie'
         ? `https://viet.${atob(autoembed)}/movie/${imdbId}`
         : `https://viet.${atob(autoembed)}/tv/${imdbId}/${season}/${episode}`;
     const links3 = await stableExtractor(server3Url);
     links3.forEach(({lang, url}) => {
       streams.push({
         server: 'Viet ' + (lang ? `-${lang}` : ''),
         link: url,
         type: 'm3u8',
        subtitles: []
       });
     });
    return streams;
  } catch (err) {
    console.error(err);
    return [];
  }
};
