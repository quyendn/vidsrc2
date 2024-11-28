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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getWhvxStream = void 0;
const axios_1 = __importDefault(require("axios"));
const getWhvxStream = (imdbId, tmdbId, season, episode, title, type, year, provider, baseUrl) => __awaiter(void 0, void 0, void 0, function* () {
    var _a, _b, _c;
    try {
        const searchQuery = encodeURIComponent(JSON.stringify({
            title: title,
            imdbId: imdbId,
            tmdbId: tmdbId,
            type: type === 'series' ? 'show' : 'movie',
            season: season || '',
            episode: episode || '',
            releaseYear: year
                ? ((_a = year === null || year === void 0 ? void 0 : year.split('–')) === null || _a === void 0 ? void 0 : _a.length) > 0
                    ? year === null || year === void 0 ? void 0 : year.split('–')[0]
                    : year
                : '',
        }));
        const headers = {
            accept: '*/*',
            'accept-language': 'en-US,en;q=0.9',
            'cache-control': 'no-cache',
            pragma: 'no-cache',
            priority: 'u=1, i',
            'sec-ch-ua': '"Chromium";v="130", "Microsoft Edge";v="130", "Not?A_Brand";v="99"',
            'sec-ch-ua-mobile': '?0',
            'sec-ch-ua-platform': '"Windows"',
            'sec-fetch-dest': 'empty',
            'sec-fetch-mode': 'cors',
            'sec-fetch-site': 'cross-site',
            origin: 'https://www.vidbinge.com',
            'user-agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/130.0.0.0 Safari/537.36 Edg/130.0.0.0',
        };
        console.log('searchQuery', {
            title: title,
            imdbId: imdbId,
            tmdbId: tmdbId,
            type: type === 'series' ? 'show' : 'movie',
            releaseYear: year
                ? ((_b = year === null || year === void 0 ? void 0 : year.split('–')) === null || _b === void 0 ? void 0 : _b.length) > 0
                    ? year === null || year === void 0 ? void 0 : year.split('–')[0]
                    : year
                : '',
            season: season,
            episode: episode,
        });
        const controller = new AbortController();
        setTimeout(() => {
            controller.abort();
        }, 4000);
        const tokenRes = yield axios_1.default.get('https://ext.8man.me/api/whvxToken', {
            timeout: 4000,
        });
        const tokenJson = tokenRes.data;
        const token = encodeURIComponent(tokenJson === null || tokenJson === void 0 ? void 0 : tokenJson.token);
        const searchRes = yield fetch(`${atob(baseUrl)}/search?query=${searchQuery}&provider=${provider}&token=${token}`, {
            headers: headers,
            signal: controller.signal,
            referrerPolicy: 'no-referrer',
            body: null,
            method: 'GET',
            mode: 'cors',
            credentials: 'omit',
        });
        const searchController = new AbortController();
        setTimeout(() => {
            searchController.abort();
        }, 4000);
        const searchJson = yield searchRes.json();
        console.log('whvx res', searchJson);
        console.log('whvx url', `${atob(baseUrl)}/search?query=${searchQuery}&provider=${provider}&token=${token}`);
        const streamRes = yield fetch(`${atob(baseUrl)}/source?resourceId=${encodeURIComponent(searchJson === null || searchJson === void 0 ? void 0 : searchJson.url)}&provider=${provider}`, {
            headers: headers,
            signal: searchController.signal,
            referrerPolicy: 'no-referrer',
            body: null,
            method: 'GET',
            mode: 'cors',
            credentials: 'omit',
        });
        const streamJson = yield streamRes.json();
        console.log('whvx', provider, streamJson);
        return ((_c = streamJson === null || streamJson === void 0 ? void 0 : streamJson.stream) === null || _c === void 0 ? void 0 : _c[0]) || null;
    }
    catch (err) {
        console.error('whvx', err);
    }
});
exports.getWhvxStream = getWhvxStream;
