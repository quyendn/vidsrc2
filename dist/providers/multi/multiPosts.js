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
exports.multiGetPostsSearch = exports.multiGetPosts = void 0;
const cheerio = __importStar(require("cheerio"));
const headers_1 = require("./headers");
const getBaseUrl_1 = require("../../utils/getBaseUrl");
const multiGetPosts = function (filter, page, providerValue, signal) {
    return __awaiter(this, void 0, void 0, function* () {
        const baseUrl = yield (0, getBaseUrl_1.getBaseUrl)('multi');
        // console.log(baseUrl);
        const url = `${baseUrl + filter}page/${page}/`;
        console.log('multiUrl', url);
        return posts(url, signal);
    });
};
exports.multiGetPosts = multiGetPosts;
const multiGetPostsSearch = function (searchQuery, page, providerValue, signal) {
    return __awaiter(this, void 0, void 0, function* () {
        const baseUrl = yield (0, getBaseUrl_1.getBaseUrl)('multi');
        // console.log(baseUrl);
        const url = `${baseUrl}/?s=${searchQuery}`;
        console.log('multiUrl', url);
        return posts(url, signal);
    });
};
exports.multiGetPostsSearch = multiGetPostsSearch;
function posts(url, signal) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const res = yield fetch(url, { headers: headers_1.headers, signal });
            const data = yield res.text();
            const $ = cheerio.load(data);
            const catalog = [];
            $('.items.full')
                .children()
                .map((i, element) => {
                const title = $(element).find('.poster').find('img').attr('alt');
                const link = $(element).find('.poster').find('a').attr('href');
                const image = $(element).find('.poster').find('img').attr('data-src') ||
                    $(element).find('.poster').find('img').attr('src');
                if (title && link && image) {
                    catalog.push({
                        title: title,
                        link: link,
                        image: image,
                    });
                }
            });
            $('.result-item').map((i, element) => {
                const title = $(element).find('.thumbnail').find('img').attr('alt');
                const link = $(element).find('.thumbnail').find('a').attr('href');
                const image = $(element).find('.thumbnail').find('img').attr('data-src') ||
                    $(element).find('.thumbnail').find('img').attr('src') ||
                    '';
                if (title && link) {
                    catalog.push({
                        title: title,
                        link: link,
                        image: image,
                    });
                }
            });
            // console.log(catalog);
            return catalog;
        }
        catch (err) {
            console.error('multiMovies error ', err);
            return [];
        }
    });
}
