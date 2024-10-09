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
exports.allGetSearchPosts = exports.allGetPost = void 0;
const axios_1 = __importDefault(require("axios"));
const headers_1 = require("./headers");
const allGetPost = function (filter, page, providerValue) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const catalog = [];
            const url = 'https://cyberflix.elfhosted.com' + filter;
            console.log('allGetPostUrl', url);
            const res = yield axios_1.default.get(url, { headers: headers_1.headers });
            const data = res.data;
            data === null || data === void 0 ? void 0 : data.metas.map((result) => {
                const title = result === null || result === void 0 ? void 0 : result.name;
                const id = (result === null || result === void 0 ? void 0 : result.imdb_id) || (result === null || result === void 0 ? void 0 : result.id);
                const type = result === null || result === void 0 ? void 0 : result.type;
                const image = result === null || result === void 0 ? void 0 : result.poster;
                if (id) {
                    catalog.push({
                        title: title,
                        link: `https://v3-cinemeta.strem.io/meta/${type}/${id}.json`,
                        image: image,
                    });
                }
            });
            console.log('catalog', catalog.length);
            return catalog;
        }
        catch (err) {
            console.error('AutoEmbed error ', err);
            return [];
        }
    });
};
exports.allGetPost = allGetPost;
const allGetSearchPosts = function (searchQuery, page, providerValue) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            if (page > 1) {
                return [];
            }
            const catalog = [];
            const url1 = `https://v3-cinemeta.strem.io/catalog/series/top/search=${encodeURI(searchQuery)}.json`;
            const url2 = `https://v3-cinemeta.strem.io/catalog/movie/top/search=${encodeURI(searchQuery)}.json`;
            const res = yield axios_1.default.get(url1, { headers: headers_1.headers });
            const data = res.data;
            data === null || data === void 0 ? void 0 : data.metas.map((result) => {
                const title = result.name || '';
                const id = (result === null || result === void 0 ? void 0 : result.imdb_id) || (result === null || result === void 0 ? void 0 : result.id);
                const image = result === null || result === void 0 ? void 0 : result.poster;
                const type = result === null || result === void 0 ? void 0 : result.type;
                if (id) {
                    catalog.push({
                        title: title,
                        link: `https://v3-cinemeta.strem.io/meta/${type}/${id}.json`,
                        image: image,
                    });
                }
            });
            const res2 = yield axios_1.default.get(url2, { headers: headers_1.headers });
            const data2 = res2.data;
            data2 === null || data2 === void 0 ? void 0 : data2.metas.map((result) => {
                const title = (result === null || result === void 0 ? void 0 : result.name) || '';
                const id = (result === null || result === void 0 ? void 0 : result.imdb_id) || (result === null || result === void 0 ? void 0 : result.id);
                const image = result === null || result === void 0 ? void 0 : result.poster;
                const type = result === null || result === void 0 ? void 0 : result.type;
                if (id) {
                    catalog.push({
                        title: title,
                        link: `https://v3-cinemeta.strem.io/meta/${type}/${id}.json`,
                        image: image,
                    });
                }
            });
            return catalog;
        }
        catch (err) {
            console.error('AutoEmbed error ', err);
            return [];
        }
    });
};
exports.allGetSearchPosts = allGetSearchPosts;
