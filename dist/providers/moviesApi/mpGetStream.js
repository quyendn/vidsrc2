"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
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
exports.mpGetStream = void 0;
const getBaseUrl_1 = require("../../utils/getBaseUrl");
const cheerio = __importStar(require("cheerio"));
const mpGetStream = (id, type) => __awaiter(void 0, void 0, void 0, function* () {
    var _a, _b;
    try {
        console.log(id);
        const streams = [];
        const { imdbId, season, episode, title, tmdbId, year } = JSON.parse(id);
        const baseUrl = yield (0, getBaseUrl_1.getBaseUrl)('moviesapi');
        const link = type === 'movie'
            ? `${baseUrl}/movie/${tmdbId}`
            : `${baseUrl}/tv/${tmdbId}-${season}-${episode}`;
        console.log('doo link', link);
        const res = yield fetch(link, {
            headers: {
                referer: baseUrl,
            },
        });
        const baseData = yield res.text();
        // console.log('baseData', baseData);
        const $ = cheerio.load(baseData);
        const embededUrl = $('iframe').attr('src') || '';
        console.log('embededUrl', embededUrl);
        // Fetch the content from the provided URL
        const response = yield fetch(embededUrl, {
            credentials: 'omit',
            headers: {
                'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:101.0) Gecko/20100101 Firefox/101.0',
                Accept: 'text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,*/*;q=0.8',
                'Accept-Language': 'en-US,en;q=0.5',
                'Alt-Used': 'w1.moviesapi.club',
                'Upgrade-Insecure-Requests': '1',
                'Sec-Fetch-Dest': 'document',
                'Sec-Fetch-Mode': 'navigate',
                'Sec-Fetch-Site': 'none',
                'Sec-Fetch-User': '?1',
                Pragma: 'no-cache',
                'Cache-Control': 'no-cache',
                referer: baseUrl,
            },
            referrer: baseUrl,
            method: 'GET',
            mode: 'cors',
        });
        const data2 = yield response.text();
        // console.log('data2', data2);
        // Extract the encrypted content
        const contents = ((_a = data2.match(/const\s+Contents\s*=\s*['"]({.*})['"]/)) === null || _a === void 0 ? void 0 : _a[1]) || '';
        console.log(contents);
        if (embededUrl) {
            const res2 = yield fetch('https://ext.8man.me/api/decrypt?passphrase=1FHuaQhhcsKgpTRB', {
                method: 'POST',
                body: contents,
            });
            const finalData = yield res2.json();
            console.log('data2', finalData);
            const subtitle = (_b = finalData === null || finalData === void 0 ? void 0 : finalData.subtitles) === null || _b === void 0 ? void 0 : _b.map((sub) => ({
                title: (sub === null || sub === void 0 ? void 0 : sub.label) || 'Unknown',
                language: sub === null || sub === void 0 ? void 0 : sub.label,
                type: "vtt",
                uri: sub === null || sub === void 0 ? void 0 : sub.file,
            }));
            streams.push({
                server: 'vidstreaming ',
                type: 'm3u8',
                subtitles: subtitle,
                link: finalData === null || finalData === void 0 ? void 0 : finalData.videoUrl,
                headers: {
                    'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:101.0) Gecko/20100101 Firefox/101.0',
                    Referer: baseUrl,
                    Origin: baseUrl,
                    Accept: '*/*',
                    'Accept-Language': 'en-US,en;q=0.5',
                    'Sec-Fetch-Dest': 'empty',
                    'Sec-Fetch-Mode': 'cors',
                    'Sec-Fetch-Site': 'cross-site',
                    Pragma: 'no-cache',
                    'Cache-Control': 'no-cache',
                },
            });
        }
        return streams;
    }
    catch (err) {
        console.error(err);
        return [];
    }
});
exports.mpGetStream = mpGetStream;
