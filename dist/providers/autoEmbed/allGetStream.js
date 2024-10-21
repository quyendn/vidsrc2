"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.allGetStream = void 0;
const multiExtractor_1 = require("./multiExtractor");
const stableExtractor_1 = require("./stableExtractor");
const autoembed = 'YXV0b2VtYmVkLmNj';
const allGetStream = (id, type) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        // console.log(id);
        const streams = [];
        const { imdbId, season, episode, title, tmdbId, year } = JSON.parse(id);
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
        // ///// flimxy
        //  const flimxyStream = await getFlimxyStream(imdbId, season, episode, type);
        //  if (flimxyStream) {
        //     for (const quality in flimxyStream?.qualities) {
        //       streams.push({
        //         server: 'Flimxy-' + quality,
        //         link: flimxyStream?.qualities?.[quality]?.url,
        //         type: flimxyStream?.qualities?.[quality]?.type || 'mp4',
        //         quality: quality as any,
        //       subtitles: []
        //       });
        //     }
        //  }
        const server1Url = type === 'movie'
            ? `https://${atob(autoembed)}/embed/oplayer.php?id=${imdbId}`
            : `https://${atob(autoembed)}/embed/oplayer.php?id=${imdbId}&s=${season}&e=${episode}`;
        const links = yield (0, multiExtractor_1.multiExtractor)(server1Url);
        links.forEach(({ lang, url }) => {
            streams.push({
                server: 'Multi' + (lang ? `-${lang}` : ''),
                link: url,
                type: 'm3u8',
                subtitles: []
            });
        });
        const server3Url = type === 'movie'
            ? `https://viet.${atob(autoembed)}/movie/${imdbId}`
            : `https://viet.${atob(autoembed)}/tv/${imdbId}/${season}/${episode}`;
        const links3 = yield (0, stableExtractor_1.stableExtractor)(server3Url);
        links3.forEach(({ lang, url }) => {
            streams.push({
                server: 'Viet ' + (lang ? `-${lang}` : ''),
                link: url,
                type: 'm3u8',
                subtitles: []
            });
        });
        return streams;
    }
    catch (err) {
        console.error(err);
        return [];
    }
});
exports.allGetStream = allGetStream;
