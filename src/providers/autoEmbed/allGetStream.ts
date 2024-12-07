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
    

    // whvx orion
    // const whvxStreamOrion = await getWhvxStream(
    //   imdbId,
    //   tmdbId,
    //   season,
    //   episode,
    //   title,
    //   type,
    //   year,
    //   'orion',
    //   'aHR0cHM6Ly9hcGkud2h2eC5uZXQ=',
    // );
    // const subtitlesOrion = [];
    // for (const caption in whvxStreamOrion?.captions) {
    //   subtitlesOrion.push({
    //     language: whvxStreamOrion?.captions?.[caption]?.language || 'Undefined',
    //     uri: whvxStreamOrion?.captions?.[caption]?.url,
    //     type:"VTT",
    //     title: whvxStreamOrion?.captions?.[caption]?.language || 'Undefined',
    //   });
    // }
    // if (whvxStreamOrion?.playlist) {
    //   streams.push({
    //     server: 'Orion',
    //     link: whvxStreamOrion?.playlist,
    //     type: whvxStreamOrion?.type === 'hls' ? 'm3u8' : 'mp4',
    //     subtitles: [],
    //     headers: {
    //       origin: atob('aHR0cHM6Ly93d3cudmlkYmluZ2UuY29t'),
    //     },
    //   });
    // }
    // console.log('whvxorion', whvxStreamOrion?.playlist);

    // const whvxStreamAstra = await getWhvxStream(
    //   imdbId,
    //   tmdbId,
    //   season,
    //   episode,
    //   title,
    //   type,
    //   year,
    //   'astra',
    //   'aHR0cHM6Ly9hcGkud2h2eC5uZXQ=',
    // );
    // console.log('whvxastra', whvxStreamAstra?.playlist);
    // const subtitlesAstra = [];
    // for (const caption in whvxStreamAstra?.captions) {
    //   subtitlesAstra.push({
    //     language: whvxStreamAstra?.captions?.[caption]?.language || 'Undefined',
    //     uri: whvxStreamAstra?.captions?.[caption]?.url,
    //     type: "VTT",
    //     title: whvxStreamAstra?.captions?.[caption]?.language || 'Undefined',
    //   });
    // }
    // if (whvxStreamAstra?.playlist) {
    //   streams.push({
    //     server: 'Astra',
    //     link: whvxStreamAstra?.playlist,
    //     type: whvxStreamAstra?.type === 'hls' ? 'm3u8' : 'mp4',
    //     subtitles: [],
    //     headers: {
    //       origin: atob('aHR0cHM6Ly93d3cudmlkYmluZ2UuY29t'),
    //     },
    //   });
    // }


    // Lấy dữ liệu từ các nguồn khác nhau song song
     //const rivePromise = getRiveStream(tmdbId, episode, season, type, streams);
    
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
        ? `https://proxy.wafflehacker.io/?destination=https://viet.${atob(autoembed)}/movie/${imdbId}`
         : `https://proxy.wafflehacker.io/?destination=https://viet.${atob(autoembed)}/tv/${imdbId}/${season}/${episode}`;
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

  //   const server4Url =
  //   type === 'movie'
  //     ? `https://2embed.wafflehacker.io/scrape?id=${imdbId}`
  //     : `https://2embed.wafflehacker.io/scrape?id=${imdbId}&s=${season}&e=${episode}`;
  // const stable4Promise = fileExtractor(server4Url).then((links4) => {
  //   links4.forEach(({ lang, url }) => {
  //     streams.push({
  //       server: '2X ' + (lang ? `-${lang}` : ''),
  //       link: url,
  //       type: 'm3u8',
  //       subtitles: [],
  //     });
  //   });
  // });

  

//   const server5Url =
//   type === 'movie'
//   ? `https://${atob(autoembed)}/embed/player.php?id=${tmdbId}`
//   : `https://${atob(
//       autoembed,
//     )}/embed/player.php?id=${tmdbId}&s=${season}&e=${episode}`;
// const stable5Promise = fileExtractor(server5Url).then((links5) => {
//   links5.forEach(({ lang, url }) => {
//     streams.push({
//       server: 'Stable ' + (lang ? `-${lang}` : ''),
//         link: url,
//         type: 'm3u8',
//       subtitles: [],
//     });
//   });
// });



    // Sử dụng Promise.all để chạy song song các yêu cầu
    await Promise.all([multiPromise,stablePromise]);
    return streams;
  } catch (err) {
    console.error(err);
    return [];
  }
};
