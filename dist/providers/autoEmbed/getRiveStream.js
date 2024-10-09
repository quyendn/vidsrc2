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
exports.getRiveStream = getRiveStream;
const axios_1 = __importDefault(require("axios"));
const getBaseUrl_1 = require("../../utils/getBaseUrl");
function getRiveStream(tmdId, episode, season, type, Streams) {
    return __awaiter(this, void 0, void 0, function* () {
        const servers = ['vidcloud', 'upcloud', 'nova'];
        const baseUrl = yield (0, getBaseUrl_1.getBaseUrl)('rive');
        const pxy = 'aHR0cHM6Ly9jcnMuMXByb3h5LndvcmtlcnMuZGV2Lz91cmw9';
        const route = type === 'series'
            ? `/api/backendfetch?requestID=tvVideoProvider&id=${tmdId}&season=${season}&episode=${episode}&service=`
            : `/api/backendfetch?requestID=movieVideoProvider&id=${tmdId}&service=`;
        const url = atob(pxy) + encodeURIComponent(baseUrl + route);
        yield Promise.all(servers.map((server) => __awaiter(this, void 0, void 0, function* () {
            var _a, _b, _c, _d, _e, _f;
            // console.log('Rive: ' + url + server);
            try {
                const res = yield axios_1.default.get(url + server, { timeout: 4000 });
                console.log('Rive Stream: ' + url + server);
                let subtitles = [];
                if ((_b = (_a = res.data) === null || _a === void 0 ? void 0 : _a.data) === null || _b === void 0 ? void 0 : _b.captions) {
                    (_d = (_c = res.data) === null || _c === void 0 ? void 0 : _c.data) === null || _d === void 0 ? void 0 : _d.captions.forEach((sub) => {
                        var _a;
                        subtitles.push({
                            language: ((_a = sub === null || sub === void 0 ? void 0 : sub.label) === null || _a === void 0 ? void 0 : _a.slice(0, 2)) || 'Und',
                            uri: sub === null || sub === void 0 ? void 0 : sub.file,
                            title: (sub === null || sub === void 0 ? void 0 : sub.label) || 'Undefined',
                            type: "vvt"
                        });
                    });
                }
                (_f = (_e = res.data) === null || _e === void 0 ? void 0 : _e.data) === null || _f === void 0 ? void 0 : _f.sources.forEach((source) => {
                    Streams.push({
                        server: (source === null || source === void 0 ? void 0 : source.source) + '-' + (source === null || source === void 0 ? void 0 : source.quality),
                        link: source === null || source === void 0 ? void 0 : source.url,
                        type: (source === null || source === void 0 ? void 0 : source.format) === 'hls' ? 'm3u8' : 'mp4',
                        quality: source === null || source === void 0 ? void 0 : source.quality,
                        subtitles: subtitles,
                    });
                });
            }
            catch (e) {
                console.log(e);
            }
        })));
    });
}
