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
const nfGetPost = function (filter, page, providerValue) {
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
            const res = yield axios_1.default.get(url, { headers: nfHeaders_1.headers });
            const data = res.data;
            const $ = cheerio.load(data);
            $('a.post-data').map((i, element) => {
                const title = '';
                const id = $(element).attr('data-post');
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
            // console.log(catalog);
            return catalog;
        }
        catch (err) {
            console.error('nf error ', err);
            return [];
        }
    });
};
exports.nfGetPost = nfGetPost;
const nfGetPostsSearch = function (searchQuery, page, providerValue) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            if (page > 1) {
                return [];
            }
            const catalog = [];
            const baseUrl = yield (0, getBaseUrl_1.getBaseUrl)('nfMirror');
            const url = `${baseUrl + '/search.php?s=' + encodeURI(searchQuery)}`;
            // console.log('search', url);
            const res = yield axios_1.default.get(url, { headers: nfHeaders_1.headers });
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
