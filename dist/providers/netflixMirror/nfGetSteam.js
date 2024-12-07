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
exports.nfGetStream = void 0;
const getBaseUrl_1 = require("../../utils/getBaseUrl");
const nfGetCookie_1 = require("./nfGetCookie");
const nfGetStream = (id) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const baseUrl = yield (0, getBaseUrl_1.getBaseUrl)('nfMirror');
        const url = `${baseUrl}/playlist.php?id=${id}&t=${Math.round(new Date().getTime() / 1000)}`;
        const cookies = (yield (0, nfGetCookie_1.nfGetCookie)()) + ' hd=on;';
        console.log('cookies', cookies);
        const res = yield fetch(url, {
            headers: {
                cookie: cookies,
            },
            credentials: 'omit',
        });
        const resJson = yield res.json();
        const data = resJson === null || resJson === void 0 ? void 0 : resJson[0];
        const streamLinks = [];
        data === null || data === void 0 ? void 0 : data.sources.forEach((source) => {
            streamLinks.push({
                server: source.label,
                link: baseUrl + source.file,
                type: 'm3u8',
                subtitles: [],
                headers: {
                    Referer: baseUrl,
                    origin: baseUrl,
                },
            });
        });
        console.log(streamLinks);
        return streamLinks;
    }
    catch (err) {
        console.error(err);
        return [];
    }
});
exports.nfGetStream = nfGetStream;
