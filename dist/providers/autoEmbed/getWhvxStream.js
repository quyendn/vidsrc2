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
exports.getWhvxStream = void 0;
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
        const searchRes = yield fetch(`${atob(baseUrl)}/search?query=${searchQuery}&provider=${provider}`, {
            headers: {
                'if-none-match': 'W/"d4-7mcv5HTZs5ogd/iJwPMEZ/NGCw0"',
                origin: atob('aHR0cHM6Ly93d3cudmlkYmluZ2UuY29t'),
            },
            signal: controller.signal,
            referrerPolicy: 'no-referrer',
            body: null,
            method: 'GET',
        });
        const searchController = new AbortController();
        setTimeout(() => {
            searchController.abort();
        }, 4000);
        const searchJson = yield searchRes.json();
        console.log('whvx', provider, searchQuery);
        const streamRes = yield fetch(`${atob(baseUrl)}/source?resourceId=${encodeURIComponent(searchJson === null || searchJson === void 0 ? void 0 : searchJson.url)}&provider=${provider}`, {
            headers: {
                'if-none-match': 'W/"d4-7mcv5HTZs5ogd/iJwPMEZ/NGCw0"',
                origin: atob('aHR0cHM6Ly93d3cudmlkYmluZ2UuY29t'),
            },
            referrerPolicy: 'no-referrer',
            body: null,
            signal: searchController.signal,
            method: 'GET',
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
