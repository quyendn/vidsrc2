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
const getFlimxyStream_1 = require("./getFlimxyStream");
const getVidSrcRip_1 = require("./getVidSrcRip");
const autoembed = 'YXV0b2VtYmVkLmNj';
const allGetStream = (id, type) => __awaiter(void 0, void 0, void 0, function* () {
    var _a, _b, _c, _d, _e, _f, _g, _h, _j, _k, _l, _m, _o, _p, _q, _r, _s, _t, _u, _v, _w, _x, _y, _z, _0, _1;
    try {
        // console.log(id);
        const streams = [];
        const { imdbId, season, episode, title, tmdbId, year } = JSON.parse(id);
        ///// whvx
        const whvxStream = yield (0, getWhvxStream_1.getWhvxStream)(imdbId, tmdbId, season, episode, title, type, year, 'nova', 'aHR0cHM6Ly9hcGkud2h2eC5uZXQ=');
        // whvx nova
        const subtitles = [];
        for (const caption in whvxStream === null || whvxStream === void 0 ? void 0 : whvxStream.captions) {
            subtitles.push({
                language: ((_b = (_a = whvxStream === null || whvxStream === void 0 ? void 0 : whvxStream.captions) === null || _a === void 0 ? void 0 : _a[caption]) === null || _b === void 0 ? void 0 : _b.language) || 'Undefined',
                uri: (_d = (_c = whvxStream === null || whvxStream === void 0 ? void 0 : whvxStream.captions) === null || _c === void 0 ? void 0 : _c[caption]) === null || _d === void 0 ? void 0 : _d.url,
                type: "srt",
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
        ///// flimxy
        const flimxyStream = yield (0, getFlimxyStream_1.getFlimxyStream)(imdbId, season, episode, type);
        if (flimxyStream) {
            for (const quality in flimxyStream === null || flimxyStream === void 0 ? void 0 : flimxyStream.qualities) {
                streams.push({
                    server: 'Flimxy-' + quality,
                    link: (_m = (_l = flimxyStream === null || flimxyStream === void 0 ? void 0 : flimxyStream.qualities) === null || _l === void 0 ? void 0 : _l[quality]) === null || _m === void 0 ? void 0 : _m.url,
                    type: ((_p = (_o = flimxyStream === null || flimxyStream === void 0 ? void 0 : flimxyStream.qualities) === null || _o === void 0 ? void 0 : _o[quality]) === null || _p === void 0 ? void 0 : _p.type) || 'mp4',
                    quality: quality,
                    subtitles: []
                });
            }
        }
        // whvx orion
        const whvxStreamOrion = yield (0, getWhvxStream_1.getWhvxStream)(imdbId, tmdbId, season, episode, title, type, year, 'orion', 'aHR0cHM6Ly9hcGkud2h2eC5uZXQ=');
        const subtitlesOrion = [];
        for (const caption in whvxStreamOrion === null || whvxStreamOrion === void 0 ? void 0 : whvxStreamOrion.captions) {
            subtitlesOrion.push({
                language: ((_r = (_q = whvxStreamOrion === null || whvxStreamOrion === void 0 ? void 0 : whvxStreamOrion.captions) === null || _q === void 0 ? void 0 : _q[caption]) === null || _r === void 0 ? void 0 : _r.language) || 'Undefined',
                uri: (_t = (_s = whvxStreamOrion === null || whvxStreamOrion === void 0 ? void 0 : whvxStreamOrion.captions) === null || _s === void 0 ? void 0 : _s[caption]) === null || _t === void 0 ? void 0 : _t.url,
                type: 'srt',
                title: ((_v = (_u = whvxStreamOrion === null || whvxStreamOrion === void 0 ? void 0 : whvxStreamOrion.captions) === null || _u === void 0 ? void 0 : _u[caption]) === null || _v === void 0 ? void 0 : _v.language) || 'Undefined',
            });
        }
        if (whvxStreamOrion === null || whvxStreamOrion === void 0 ? void 0 : whvxStreamOrion.playlist) {
            streams.push({
                server: 'Orion',
                link: whvxStreamOrion === null || whvxStreamOrion === void 0 ? void 0 : whvxStreamOrion.playlist,
                type: (whvxStreamOrion === null || whvxStreamOrion === void 0 ? void 0 : whvxStreamOrion.type) === 'hls' ? 'm3u8' : 'mp4',
                subtitles: subtitlesOrion,
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
        ///// nsbx
        const nsbxStream = yield (0, getWhvxStream_1.getWhvxStream)(imdbId, tmdbId, season, episode, title, type, year, 'alpha', 'aHR0cHM6Ly9uc2J4LndhZmZsZWhhY2tlci5pbw==');
        const subtitlesNsbx = [];
        for (const caption in nsbxStream === null || nsbxStream === void 0 ? void 0 : nsbxStream.captions) {
            subtitlesNsbx.push({
                language: ((_x = (_w = nsbxStream === null || nsbxStream === void 0 ? void 0 : nsbxStream.captions) === null || _w === void 0 ? void 0 : _w[caption]) === null || _x === void 0 ? void 0 : _x.language) || 'Undefined',
                uri: (_z = (_y = nsbxStream === null || nsbxStream === void 0 ? void 0 : nsbxStream.captions) === null || _y === void 0 ? void 0 : _y[caption]) === null || _z === void 0 ? void 0 : _z.url,
                type: 'srt',
                title: ((_1 = (_0 = nsbxStream === null || nsbxStream === void 0 ? void 0 : nsbxStream.captions) === null || _0 === void 0 ? void 0 : _0[caption]) === null || _1 === void 0 ? void 0 : _1.language) || 'Undefined',
            });
        }
        if (nsbxStream === null || nsbxStream === void 0 ? void 0 : nsbxStream.playlist) {
            streams.push({
                server: 'Nsbx',
                link: nsbxStream === null || nsbxStream === void 0 ? void 0 : nsbxStream.playlist,
                type: (nsbxStream === null || nsbxStream === void 0 ? void 0 : nsbxStream.type) === 'hls' ? 'm3u8' : 'mp4',
                subtitles: subtitlesNsbx,
                headers: {
                    origin: atob('aHR0cHM6Ly93d3cudmlkYmluZ2UuY29t'),
                },
            });
        }
        ///// rive
        //await getRiveStream(tmdbId, episode, season, type, streams);
        ///// vidsrcrip
        yield (0, getVidSrcRip_1.getVidSrcRip)(tmdbId, season, episode, streams);
        ///// autoembed
        // server1
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
        // server 2
        // const server2Url =
        //   type === 'movie'
        //     ? `https://duka.${atob(autoembed)}/movie/${imdbId}`
        //     : `https://duka.${atob(autoembed)}/tv/${imdbId}/${season}/${episode}`;
        // const links2 = await stableExtractor(server2Url);
        // links2.forEach(({lang, url}) => {
        //   streams.push({
        //     server: 'Stable ' + (lang ? `-${lang}` : ''),
        //     link: url,
        //     type: 'm3u8',
        //   });
        // });
        // server 3
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
