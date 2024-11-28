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
exports.multiGetInfo = void 0;
const axios_1 = __importDefault(require("axios"));
const cheerio = __importStar(require("cheerio"));
const headers_1 = require("./headers");
const multiGetInfo = function (link) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const url = link;
            // console.log('url', url);
            const res = yield axios_1.default.get(url, { headers: headers_1.headers });
            const data = res.data;
            const $ = cheerio.load(data);
            const type = url.includes('tvshows') ? 'series' : 'movie';
            const imdbId = '';
            const title = url.split('/')[4].replace(/-/g, ' ');
            const image = $('.g-item').find('a').attr('href') || '';
            const synopsis = $('.wp-content').find('p').text() || '';
            // console.log(title, image, synopsis);
            // Links
            const links = [];
            if (type === 'series') {
                $('#seasons')
                    .children()
                    .map((i, element) => {
                    const title = $(element)
                        .find('.title')
                        .children()
                        .remove()
                        .end()
                        .text();
                    let episodesList = [];
                    $(element)
                        .find('.episodios')
                        .children()
                        .map((i, element) => {
                        const title = 'Episode' +
                            $(element).find('.numerando').text().trim().split('-')[1];
                        const link = $(element).find('a').attr('href');
                        if (title && link) {
                            episodesList.push({ title, link });
                        }
                    });
                    if (title && episodesList.length > 0) {
                        links.push({
                            title,
                            directLinks: episodesList,
                            id: ""
                        });
                    }
                });
            }
            else {
                links.push({
                    id: "",
                    title: title,
                    directLinks: [{ title: title, link: url.slice(0, -1), type: 'movie' }],
                });
            }
            // console.log('multi meta', links);
            return {
                id: "",
                title,
                synopsis,
                image,
                imdbId,
                type,
                linkList: links,
            };
        }
        catch (err) {
            console.error(err);
            return {
                id: "",
                title: '',
                synopsis: '',
                image: '',
                imdbId: '',
                type: 'movie',
                linkList: [],
            };
        }
    });
};
exports.multiGetInfo = multiGetInfo;
