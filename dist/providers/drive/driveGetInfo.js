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
exports.driveGetInfo = void 0;
const axios_1 = __importDefault(require("axios"));
const cheerio = __importStar(require("cheerio"));
const header_1 = require("./header");
const driveGetInfo = function (link) {
    return __awaiter(this, void 0, void 0, function* () {
        var _a;
        try {
            const url = link;
            const res = yield axios_1.default.get(url, { headers: header_1.headers });
            const data = res.data;
            const $ = cheerio.load(data);
            const type = $('.left-wrapper')
                .text()
                .toLocaleLowerCase()
                .includes('movie name')
                ? 'movie'
                : 'series';
            const imdbId = ((_a = $('a:contains("IMDb")').attr('href')) === null || _a === void 0 ? void 0 : _a.split('/')[4]) || '';
            const title = $('.left-wrapper').find('strong:contains("Name")').next().text() ||
                $('.left-wrapper')
                    .find('strong:contains("Name"),h5:contains("Name")')
                    .find('span:first')
                    .text();
            const synopsis = $('.left-wrapper')
                .find('h2:contains("Storyline"),h3:contains("Storyline"),h5:contains("Storyline"),h4:contains("Storyline"),h4:contains("STORYLINE")')
                .next()
                .text() ||
                $('.ipc-html-content-inner-div').text() ||
                '';
            const image = $('img.entered.lazyloaded,img.entered,img.litespeed-loaded').attr('src') ||
                $('img.aligncenter').attr('src') ||
                '';
            // Links
            const links = [];
            $('a:contains("1080")a:not(:contains("Zip")),a:contains("720")a:not(:contains("Zip")),a:contains("480")a:not(:contains("Zip")),a:contains("2160")a:not(:contains("Zip")),a:contains("4k")a:not(:contains("Zip"))').map((i, element) => {
                var _a;
                const title = $(element).parent('h5').prev().text();
                const episodesLink = $(element).attr('href');
                const quality = ((_a = title.match(/\b(480p|720p|1080p|2160p)\b/i)) === null || _a === void 0 ? void 0 : _a[0]) || '';
                if (episodesLink && title) {
                    links.push({
                        id: "0",
                        title,
                        episodesLink: type === 'series' ? episodesLink : '',
                        directLinks: type === 'movie'
                            ? [{ title: 'Movie', link: episodesLink, type: 'movie' }]
                            : [],
                        quality: quality,
                    });
                }
            });
            // console.log('drive meta', title, synopsis, image, imdbId, type, links);
            console.log('drive meta', links, type);
            return {
                id: "0",
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
                id: "0",
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
exports.driveGetInfo = driveGetInfo;
