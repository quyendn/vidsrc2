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
exports.nfGetInfo = void 0;
const axios_1 = __importDefault(require("axios"));
const nfHeaders_1 = require("./nfHeaders");
const nfGetInfo = function (link) {
    return __awaiter(this, void 0, void 0, function* () {
        var _a, _b, _c, _d;
        try {
            const url = link;
            console.log('nfifo', url);
            const res = yield axios_1.default.get(url, {
                headers: nfHeaders_1.headers,
            });
            const data = res.data;
            console.log('data', data);
            const id = (_a = link.split('id=')[1]) === null || _a === void 0 ? void 0 : _a.split('&')[0];
            const meta = {
                id: id,
                title: data.title,
                synopsis: data.desc,
                image: `https://img.nfmirrorcdn.top/poster/h/${id}.jpg`,
                cast: (_b = data === null || data === void 0 ? void 0 : data.short_cast) === null || _b === void 0 ? void 0 : _b.split(','),
                tags: [data === null || data === void 0 ? void 0 : data.year, data === null || data === void 0 ? void 0 : data.hdsd, ...(_c = data === null || data === void 0 ? void 0 : data.thismovieis) === null || _c === void 0 ? void 0 : _c.split(',')],
                imdbId: '',
                type: 'series',
            };
            console.log('nfinfo', meta);
            const linkList = [];
            if (((_d = data === null || data === void 0 ? void 0 : data.season) === null || _d === void 0 ? void 0 : _d.length) > 0) {
                data.season.map((season) => {
                    linkList.push({
                        id: id,
                        title: 'Season ' + (season === null || season === void 0 ? void 0 : season.s),
                        episodesLink: season === null || season === void 0 ? void 0 : season.id,
                    });
                });
            }
            else {
                linkList.push({
                    id: id,
                    title: meta.title,
                    directLinks: [{ link: link, title: 'Movie', type: 'movie' }],
                });
            }
            return Object.assign(Object.assign({}, meta), { linkList: linkList });
        }
        catch (err) {
            console.error(err);
            return {
                id: '',
                title: '',
                synopsis: '',
                image: '',
                imdbId: '',
                type: '',
                linkList: [],
            };
        }
    });
};
exports.nfGetInfo = nfGetInfo;
