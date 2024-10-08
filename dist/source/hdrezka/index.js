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
exports.hdRezkaScraper = void 0;
const targets_1 = require("../../utils/targets");
const base_1 = require("../../../src/base");
const errors_1 = require("../../utils/errors");
const utils_1 = require("./utils");
const rezkaBase = 'https://hdrzk.org';
const baseHeaders = {
    'X-Hdrezka-Android-App': '1',
    'X-Hdrezka-Android-App-Version': '2.2.0',
};
function searchAndFindMediaId(ctx) {
    return __awaiter(this, void 0, void 0, function* () {
        var _a, _b;
        const itemRegexPattern = /<a href="([^"]+)"><span class="enty">([^<]+)<\/span> \(([^)]+)\)/g;
        const idRegexPattern = /\/(\d+)-[^/]+\.html$/;
        const params = new URLSearchParams({ q: ctx.media.title });
        const searchResponse = yield fetch(`${rezkaBase}/engine/ajax/search.php?${params}`, {
            method: 'GET',
            headers: baseHeaders,
        });
        const searchData = yield searchResponse.text();
        const movieData = [];
        for (const match of searchData.matchAll(itemRegexPattern)) {
            const url = match[1];
            const titleAndYear = match[3];
            const result = (0, utils_1.extractTitleAndYear)(titleAndYear);
            if (result !== null) {
                const id = ((_a = url.match(idRegexPattern)) === null || _a === void 0 ? void 0 : _a[1]) || null;
                movieData.push({ id: id !== null && id !== void 0 ? id : '', year: (_b = result.year) !== null && _b !== void 0 ? _b : 0, type: ctx.media.type, url });
            }
        }
        const filteredItems = movieData.filter((item) => item.type === ctx.media.type && item.year === ctx.media.releaseYear);
        return filteredItems[0] || null;
    });
}
function getStream(id, translatorId, ctx) {
    return __awaiter(this, void 0, void 0, function* () {
        const searchParams = new URLSearchParams();
        searchParams.append('id', id);
        searchParams.append('translator_id', translatorId);
        if (ctx.media.type === 'show') {
            searchParams.append('season', ctx.media.season.number.toString());
            searchParams.append('episode', ctx.media.episode.number.toString());
        }
        if (ctx.media.type === 'movie') {
            searchParams.append('is_camprip', '0');
            searchParams.append('is_ads', '0');
            searchParams.append('is_director', '0');
        }
        searchParams.append('favs', (0, utils_1.generateRandomFavs)());
        searchParams.append('action', ctx.media.type === 'show' ? 'get_stream' : 'get_movie');
        const streamResponse = yield fetch(`${rezkaBase}/ajax/get_cdn_series/`, {
            method: 'POST',
            body: searchParams,
            headers: baseHeaders,
        });
        const responseText = yield streamResponse.text();
        console.warn(JSON.parse(responseText));
        return JSON.parse(responseText);
    });
}
function getTranslatorId(url, id, ctx) {
    return __awaiter(this, void 0, void 0, function* () {
        const translatorResponse = yield fetch(url, {
            method: 'GET',
            headers: baseHeaders,
        });
        const responseText = yield translatorResponse.text();
        if (responseText.includes(`data-translator_id="238"`))
            return '238';
        const functionName = ctx.media.type === 'movie' ? 'initCDNMoviesEvents' : 'initCDNSeriesEvents';
        const regexPattern = new RegExp(`sof\\.tv\\.${functionName}\\(${id}, ([^,]+)`, 'i');
        const match = responseText.match(regexPattern);
        const translatorId = match ? match[1] : null;
        return translatorId;
    });
}
const universalScraper = (ctx) => __awaiter(void 0, void 0, void 0, function* () {
    const result = yield searchAndFindMediaId(ctx);
    if (!result || !result.id)
        throw new errors_1.NotFoundError('No result found');
    const translatorId = yield getTranslatorId(result.url, result.id, ctx);
    if (!translatorId)
        throw new errors_1.NotFoundError('No translator id found');
    const { url: streamUrl, subtitle: streamSubtitle } = yield getStream(result.id, translatorId, ctx);
    const parsedVideos = (0, utils_1.parseVideoLinks)(streamUrl);
    const parsedSubtitles = (0, utils_1.parseSubtitleLinks)(streamSubtitle);
    return {
        embeds: [],
        stream: [
            {
                id: 'primary',
                type: 'file',
                flags: [targets_1.flags.CORS_ALLOWED, targets_1.flags.IP_LOCKED],
                captions: parsedSubtitles,
                qualities: parsedVideos,
            },
        ],
    };
});
exports.hdRezkaScraper = (0, base_1.makeSourcerer)({
    id: 'hdrezka',
    name: 'HDRezka',
    disabled: false,
    rank: 120,
    flags: [targets_1.flags.CORS_ALLOWED, targets_1.flags.IP_LOCKED],
    scrapeShow: universalScraper,
    scrapeMovie: universalScraper,
});
