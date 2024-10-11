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
const getWhvxStream_1 = require("./getWhvxStream");
const autoembed = 'YXV0b2VtYmVkLmNj';
const allGetStream = (id, type) => __awaiter(void 0, void 0, void 0, function* () {
    var _a, _b, _c, _d, _e, _f, _g, _h, _j, _k;
    try {
        // console.log(id);
        const streams = [];
        const { imdbId, season, episode, title, tmdbId, year } = JSON.parse(id);
        ///// whvx
        const whvxStream = yield (0, getWhvxStream_1.getWhvxStream)(imdbId, tmdbId, season, episode, title, type, year, 'nova', 'aHR0cHM6Ly9hcGkud2h2eC5uZXQ=');
        //whvx nova
        const subtitles = [];
        for (const caption in whvxStream === null || whvxStream === void 0 ? void 0 : whvxStream.captions) {
            subtitles.push({
                language: ((_b = (_a = whvxStream === null || whvxStream === void 0 ? void 0 : whvxStream.captions) === null || _a === void 0 ? void 0 : _a[caption]) === null || _b === void 0 ? void 0 : _b.language) || 'Undefined',
                uri: (_d = (_c = whvxStream === null || whvxStream === void 0 ? void 0 : whvxStream.captions) === null || _c === void 0 ? void 0 : _c[caption]) === null || _d === void 0 ? void 0 : _d.url,
                type: 'srt',
                title: ((_f = (_e = whvxStream === null || whvxStream === void 0 ? void 0 : whvxStream.captions) === null || _e === void 0 ? void 0 : _e[caption]) === null || _f === void 0 ? void 0 : _f.language) || 'Undefined',
            });
        }
        for (const quality in whvxStream === null || whvxStream === void 0 ? void 0 : whvxStream.qualities) {
            streams.push({
                server: 'Nova-' + quality,
                link: (_h = (_g = whvxStream === null || whvxStream === void 0 ? void 0 : whvxStream.qualities) === null || _g === void 0 ? void 0 : _g[quality]) === null || _h === void 0 ? void 0 : _h.url,
                type: ((_k = (_j = whvxStream === null || whvxStream === void 0 ? void 0 : whvxStream.qualities) === null || _j === void 0 ? void 0 : _j[quality]) === null || _k === void 0 ? void 0 : _k.type) || 'mp4',
                subtitles: subtitles,
                quality: quality,
            });
        }
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
        // const server1Url =
        //   type === 'movie'
        //     ? `https://${atob(autoembed)}/embed/oplayer.php?id=${imdbId}`
        //     : `https://${atob(
        //         autoembed,
        //       )}/embed/oplayer.php?id=${imdbId}&s=${season}&e=${episode}`;
        // const links = await multiExtractor(server1Url);
        // links.forEach(({lang, url}) => {
        //   streams.push({
        //     server: 'Multi' + (lang ? `-${lang}` : ''),
        //     link: url,
        //     type: 'm3u8',
        //     subtitles : []
        //   });
        // });
        // const server3Url =
        //   type === 'movie'
        //     ? `https://viet.${atob(autoembed)}/movie/${imdbId}`
        //     : `https://viet.${atob(autoembed)}/tv/${imdbId}/${season}/${episode}`;
        // const links3 = await stableExtractor(server3Url);
        // links3.forEach(({lang, url}) => {
        //   streams.push({
        //     server: 'Viet ' + (lang ? `-${lang}` : ''),
        //     link: url,
        //     type: 'm3u8',
        //     subtitles: []
        //   });
        // });
        return streams;
    }
    catch (err) {
        console.error(err);
        return [];
    }
});
exports.allGetStream = allGetStream;
