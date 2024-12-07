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
exports.nfGetPostsSearch = exports.nfGetPost = void 0;
const axios_1 = __importDefault(require("axios"));
const cheerio = __importStar(require("cheerio"));
const nfHeaders_1 = require("./nfHeaders");
const getBaseUrl_1 = require("../../utils/getBaseUrl");
const nfGetCookie_1 = require("./nfGetCookie");
const nfGetPost = function (filter, page, providerValue, signal) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const baseUrl = yield (0, getBaseUrl_1.getBaseUrl)('nfMirror');
            const catalog = [];
            if (page > 1) {
                return [];
            }
            // console.log(filter);
            const url = `${baseUrl + filter}`;
            // console.log(url);
            const cookie = (yield (0, nfGetCookie_1.nfGetCookie)()) + ' hd=on; ott=nf;';
            console.log('nfCookie', cookie);
            const res = yield fetch(url, {
                headers: {
                    accept: 'text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,image/apng,*/*;q=0.8,application/signed-exchange;v=b3;q=0.7',
                    'accept-language': 'en-US,en;q=0.9,en-IN;q=0.8',
                    'cache-control': 'no-cache',
                    pragma: 'no-cache',
                    cookie: cookie,
                    priority: 'u=0, i',
                    'sec-ch-ua': '"Chromium";v="130", "Microsoft Edge";v="130", "Not?A_Brand";v="99"',
                    'sec-ch-ua-mobile': '?0',
                    'sec-ch-ua-platform': '"Windows"',
                    'sec-fetch-dest': 'document',
                    'sec-fetch-mode': 'navigate',
                    'sec-fetch-site': 'same-origin',
                    'sec-fetch-user': '?1',
                    'upgrade-insecure-requests': '1',
                },
                referrer: 'https://iosmirror.cc/movies',
                referrerPolicy: 'strict-origin-when-cross-origin',
                body: null,
                signal: signal,
                method: 'GET',
                mode: 'cors',
                credentials: 'omit',
            });
            const data = yield res.text();
            // console.log('nfPost', data);
            const $ = cheerio.load(data);
            $('a.post-data').map((i, element) => {
                const title = '';
                const id = $(element).attr('data-post');
                console.log('id', id);
                const image = $(element).find('img').attr('data-src') || '';
                if (id) {
                    catalog.push({
                        title: title,
                        link: baseUrl +
                            '/post.php?id=' +
                            id +
                            '&t=' +
                            Math.round(new Date().getTime() / 1000),
                        image: image,
                    });
                }
            });
            console.log(catalog);
            return catalog;
        }
        catch (err) {
            console.error('nf error ', err);
            return [];
        }
    });
};
exports.nfGetPost = nfGetPost;
const nfGetPostsSearch = function (searchQuery, page, providerValue, signal) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            if (page > 1) {
                return [];
            }
            const catalog = [];
            const baseUrl = yield (0, getBaseUrl_1.getBaseUrl)('nfMirror');
            const url = `${baseUrl + '/search.php?s=' + encodeURI(searchQuery)}`;
            // console.log('search', url);
            const headers = yield (0, nfHeaders_1.getNfHeaders)();
            const res = yield axios_1.default.get(url, { headers, signal });
            const data = res.data;
            data === null || data === void 0 ? void 0 : data.searchResult.map((result) => {
                const title = result === null || result === void 0 ? void 0 : result.t;
                const id = result === null || result === void 0 ? void 0 : result.id;
                const image = `https://img.nfmirrorcdn.top/poster/v/${id}.jpg`;
                if (id) {
                    catalog.push({
                        title: title,
                        link: baseUrl +
                            '/post.php?id=' +
                            id +
                            '&t=' +
                            Math.round(new Date().getTime() / 1000),
                        image: image,
                    });
                }
            });
            // console.log('nfSearch', catalog);
            return catalog;
        }
        catch (err) {
            console.error('nf error ', err);
            return [];
        }
    });
};
exports.nfGetPostsSearch = nfGetPostsSearch;
