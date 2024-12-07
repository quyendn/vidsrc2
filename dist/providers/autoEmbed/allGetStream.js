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
const multiExtractor_1 = require("./multiExtractor");
const stableExtractor_1 = require("./stableExtractor");
const fileExtractor_1 = require("./fileExtractor");
const autoembed = 'YXV0b2VtYmVkLmNj';
const allGetStream = (id, type) => __awaiter(void 0, void 0, void 0, function* () {
    var _a, _b, _c, _d, _e, _f;
    try {
        const streams = [];
        const { imdbId, season, episode, title, tmdbId, year } = JSON.parse(id);
        // whvx orion
        const whvxStreamOrion = yield (0, getWhvxStream_1.getWhvxStream)(imdbId, tmdbId, season, episode, title, type, year, 'orion', 'aHR0cHM6Ly9hcGkud2h2eC5uZXQ=');
        const subtitlesOrion = [];
        for (const caption in whvxStreamOrion === null || whvxStreamOrion === void 0 ? void 0 : whvxStreamOrion.captions) {
            subtitlesOrion.push({
                language: ((_b = (_a = whvxStreamOrion === null || whvxStreamOrion === void 0 ? void 0 : whvxStreamOrion.captions) === null || _a === void 0 ? void 0 : _a[caption]) === null || _b === void 0 ? void 0 : _b.language) || 'Undefined',
                uri: (_d = (_c = whvxStreamOrion === null || whvxStreamOrion === void 0 ? void 0 : whvxStreamOrion.captions) === null || _c === void 0 ? void 0 : _c[caption]) === null || _d === void 0 ? void 0 : _d.url,
                type: "VTT",
                title: ((_f = (_e = whvxStreamOrion === null || whvxStreamOrion === void 0 ? void 0 : whvxStreamOrion.captions) === null || _e === void 0 ? void 0 : _e[caption]) === null || _f === void 0 ? void 0 : _f.language) || 'Undefined',
            });
        }
        if (whvxStreamOrion === null || whvxStreamOrion === void 0 ? void 0 : whvxStreamOrion.playlist) {
            streams.push({
                server: 'Orion',
                link: whvxStreamOrion === null || whvxStreamOrion === void 0 ? void 0 : whvxStreamOrion.playlist,
                type: (whvxStreamOrion === null || whvxStreamOrion === void 0 ? void 0 : whvxStreamOrion.type) === 'hls' ? 'm3u8' : 'mp4',
                subtitles: [],
                headers: {
                    origin: atob('aHR0cHM6Ly93d3cudmlkYmluZ2UuY29t'),
                },
            });
        }
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
        const server1Url = type === 'movie'
            ? `https://${atob(autoembed)}/embed/oplayer.php?id=${imdbId}`
            : `https://${atob(autoembed)}/embed/oplayer.php?id=${imdbId}&s=${season}&e=${episode}`;
        const multiPromise = (0, multiExtractor_1.multiExtractor)(server1Url).then((links) => {
            links.forEach(({ lang, url }) => {
                streams.push({
                    server: 'Multi' + (lang ? `-${lang}` : ''),
                    link: url,
                    type: 'm3u8',
                    subtitles: [],
                });
            });
        });
        const server3Url = type === 'movie'
            ? `https://proxy.wafflehacker.io/?destination=https://viet.${atob(autoembed)}/movie/${imdbId}`
            : `https://proxy.wafflehacker.io/?destination=https://viet.${atob(autoembed)}/tv/${imdbId}/${season}/${episode}`;
        const stablePromise = (0, stableExtractor_1.stableExtractor)(server3Url).then((links3) => {
            links3.forEach(({ lang, url }) => {
                streams.push({
                    server: 'Viet ' + (lang ? `-${lang}` : ''),
                    link: url,
                    type: 'm3u8',
                    subtitles: [],
                });
            });
        });
        const server4Url = type === 'movie'
            ? `https://2embed.wafflehacker.io/scrape?id=${imdbId}`
            : `https://2embed.wafflehacker.io/scrape?id=${imdbId}&s=${season}&e=${episode}`;
        const stable4Promise = (0, fileExtractor_1.fileExtractor)(server4Url).then((links4) => {
            links4.forEach(({ lang, url }) => {
                streams.push({
                    server: '2X ' + (lang ? `-${lang}` : ''),
                    link: url,
                    type: 'm3u8',
                    subtitles: [],
                });
            });
        });
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
        yield Promise.all([whvxStreamOrion, multiPromise, stablePromise, stable4Promise]);
        return streams;
    }
    catch (err) {
        console.error(err);
        return [];
    }
});
exports.allGetStream = allGetStream;
