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
const fileExtractor_1 = require("./fileExtractor");
const getRiveStream_1 = require("./getRiveStream");
const autoembed = 'YXV0b2VtYmVkLmNj';
const allGetStream = (id, type) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const streams = [];
        const { imdbId, season, episode, title, tmdbId, year } = JSON.parse(id);
        // Lấy dữ liệu từ các nguồn khác nhau song song
        const rivePromise = (0, getRiveStream_1.getRiveStream)(tmdbId, episode, season, type, streams);
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
            ? `https://viet.${atob(autoembed)}/movie/${imdbId}`
            : `https://viet.${atob(autoembed)}/tv/${imdbId}/${season}/${episode}`;
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
        // Sử dụng Promise.all để chạy song song các yêu cầu
        yield Promise.all([rivePromise, multiPromise, server3Url, stable4Promise]);
        return streams;
    }
    catch (err) {
        console.error(err);
        return [];
    }
});
exports.allGetStream = allGetStream;
