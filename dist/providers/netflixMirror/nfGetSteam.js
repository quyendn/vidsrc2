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
exports.nfGetStream = void 0;
const axios_1 = __importDefault(require("axios"));
const nfHeaders_1 = require("./nfHeaders");
const getBaseUrl_1 = require("../../utils/getBaseUrl");
const nfGetStream = (id) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    try {
        const baseUrl = yield (0, getBaseUrl_1.getBaseUrl)('nfMirror');
        const url = `${baseUrl}/playlist.php?id=${id}&t=${Math.round(new Date().getTime() / 1000)}`;
        const res = yield axios_1.default.get(url, {
            headers: nfHeaders_1.headers,
        });
        const data = (_a = res.data) === null || _a === void 0 ? void 0 : _a[0];
        const streamLinks = [];
        data === null || data === void 0 ? void 0 : data.sources.forEach((source) => {
            streamLinks.push({
                server: source.label,
                link: baseUrl + source.file,
                subtitles: [],
                type: 'm3u8',
                headers: {
                    Referer: baseUrl,
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
