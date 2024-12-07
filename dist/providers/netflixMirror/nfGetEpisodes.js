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
exports.nfGetEpisodes = void 0;
const axios_1 = __importDefault(require("axios"));
const nfHeaders_1 = require("./nfHeaders");
const getBaseUrl_1 = require("../../utils/getBaseUrl");
const nfGetEpisodes = function (link) {
    return __awaiter(this, void 0, void 0, function* () {
        var _a;
        try {
            const baseUrl = yield (0, getBaseUrl_1.getBaseUrl)('nfMirror');
            const url = `${baseUrl}/episodes.php?s=` +
                link +
                '&t=' +
                Math.round(new Date().getTime() / 1000);
            console.log('nfEpisodesUrl', url);
            const headers = yield (0, nfHeaders_1.getNfHeaders)();
            const res = yield axios_1.default.get(url, {
                headers: headers,
            });
            const data = res.data;
            const episodeList = [];
            (_a = data === null || data === void 0 ? void 0 : data.episodes) === null || _a === void 0 ? void 0 : _a.map((episode) => {
                episodeList.push({
                    title: 'Episode ' + (episode === null || episode === void 0 ? void 0 : episode.ep.replace('E', '')),
                    link: episode === null || episode === void 0 ? void 0 : episode.id,
                });
            });
            return episodeList;
        }
        catch (err) {
            console.error(err);
            return [];
        }
    });
};
exports.nfGetEpisodes = nfGetEpisodes;
