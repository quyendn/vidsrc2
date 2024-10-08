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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const types_1 = require("../utils/types");
const querystring = __importStar(require("querystring"));
const axios_1 = __importDefault(require("axios"));
const utils_1 = require("../source/hdrezka/utils");
const rezkaBase = 'https://hdrzk.org';
const baseHeaders = {
    'Host': 'proxy.wafflehacker.io',
    'Origin': 'https://www.vidbinge.com',
    'X-Hdrezka-Android-App': '1',
    'X-Hdrezka-Android-App-Version': '2.2.0',
};
const baseHeadersX = {
    'X-Hdrezka-Android-App': '1',
    'X-Hdrezka-Android-App-Version': '2.2.0',
};
const API_KEY = '85f31af1-9be8-4122-8c0d-06f502e51d5c';
function getScrapeOpsUrl(url) {
    const payload = {
        api_key: API_KEY,
        url: url,
        keep_headers: true
    };
    const proxyUrl = 'https://proxy.scrapeops.io/v1/?' + querystring.stringify(payload);
    return proxyUrl;
}
// Hàm tìm kiếm media dựa trên tiêu đề
function searchMedia(title, type, year) {
    return __awaiter(this, void 0, void 0, function* () {
        var _a, _b;
        const itemRegexPattern = /<a href="([^"]+)"><span class="enty">([^<]+)<\/span> \(([^)]+)\)/g;
        const idRegexPattern = /\/(\d+)-[^/]+\.html$/;
        const params = new URLSearchParams({ q: title });
        const movieData = [];
        const response = yield axios_1.default.get(`${rezkaBase}/engine/ajax/search.php?${params}`, {
            method: 'GET',
            headers: baseHeadersX,
        });
        const data = yield response.data; // Vì API trả về HTML
        console.log('Search results:', data);
        for (const match of data.matchAll(itemRegexPattern)) {
            const url = match[1];
            const titleAndYear = match[3];
            const result = (0, utils_1.extractTitleAndYear)(titleAndYear);
            if (result !== null) {
                const id = ((_a = url.match(idRegexPattern)) === null || _a === void 0 ? void 0 : _a[1]) || null;
                movieData.push({ id: id !== null && id !== void 0 ? id : '', year: (_b = result.year) !== null && _b !== void 0 ? _b : 0, type: "movie", url });
            }
        }
        const filteredItems = movieData.filter((item) => item.type === type && item.year === year);
        return filteredItems[0] || null;
    });
}
// Hàm lấy thông tin stream của media
function getStreamData(id, translatorId, mediaType, season, episode) {
    return __awaiter(this, void 0, void 0, function* () {
        const searchParams = new URLSearchParams();
        searchParams.append('id', id);
        searchParams.append('translator_id', translatorId);
        if (mediaType === 'show' && season && episode) {
            searchParams.append('season', season.toString());
            searchParams.append('episode', episode.toString());
        }
        else if (mediaType === 'movie') {
            searchParams.append('is_camprip', '0');
            searchParams.append('is_ads', '0');
            searchParams.append('is_director', '0');
        }
        searchParams.append('favs', (0, utils_1.generateRandomFavs)()); // Hàm tạo favs giả lập
        searchParams.append('action', mediaType === 'show' ? 'get_stream' : 'get_movie');
        try {
            const response = yield axios_1.default.post(`${rezkaBase}/ajax/get_cdn_series/`, searchParams, {
                headers: baseHeadersX,
            });
            const data = yield response.data; // Phản hồi JSON
            console.log('Stream data:', data);
            return data; // Trả về link video và subtitles
        }
        catch (error) {
            console.error('Error fetching stream data:', error);
            return null;
        }
    });
}
// Hàm lấy translatorId dựa trên URL của media
function getTranslatorId(url, mediaId, mediaType) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            let urlTranslation = "https://proxy.wafflehacker.io/?destination=" + url;
            const response = yield axios_1.default.get(urlTranslation, {
                method: 'GET',
                headers: baseHeaders,
            });
            const html = yield response.data;
            const translatorMatch = html.match(/data-translator_id="(\d+)"/);
            if (translatorMatch) {
                return translatorMatch[1];
            }
            // Nếu không tìm thấy, thử với hàm initCDNSeriesEvents hoặc initCDNMoviesEvents
            const functionName = mediaType === 'movie' ? 'initCDNMoviesEvents' : 'initCDNSeriesEvents';
            const regex = new RegExp(`sof\\.tv\\.${functionName}\\(${mediaId}, ([^,]+)`, 'i');
            const match = html.match(regex);
            return match ? match[1] : null;
        }
        catch (error) {
            console.error('Error fetching translator ID:', error);
            return null;
        }
    });
}
class Hdrezka extends types_1.Provider {
    constructor() {
        super(...arguments);
        this.baseUrl = "https://vidsrc.cc/";
        this.headers = {
            Referer: this.baseUrl,
            "X-Requested-With": "XMLHttpRequest",
            "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/129.0.0.0 Safari/537.36",
        };
    }
    getSource(id, isMovie, season, episode) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                let name = 'The Batman';
                let type = 'movie';
                let year = 2022;
                // Tìm kiếm phim dựa trên tiêu đề
                const searchResult = yield searchMedia(name, type, year);
                console.log(searchResult);
                // Lấy translatorId từ trang chi tiết phim
                const translatorId = yield getTranslatorId(searchResult.url, searchResult.id, 'movie');
                if (!translatorId)
                    return;
                // Lấy link stream của phim
                const { url: streamUrl, subtitle: streamSubtitle } = yield getStreamData(searchResult.id, translatorId, 'movie');
                const parsedVideos = (0, utils_1.parseVideoLinks)(streamUrl);
                const parsedSubtitles = (0, utils_1.parseSubtitleLinks)(streamSubtitle);
                // return title;
                return Object.assign({ parsedSubtitles }, parsedVideos);
            }
            catch (error) {
                console.log("faild ", error);
                throw error;
            }
        });
    }
}
exports.default = Hdrezka;
