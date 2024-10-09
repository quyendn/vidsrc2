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
//vidsrc.cc/v2/embed/tv/124364/1/5
const querystring = __importStar(require("querystring"));
const types_1 = require("../utils/types");
const API_KEY = '85f31af1-9be8-4122-8c0d-06f502e51d5c';
const axios_1 = __importDefault(require("axios"));
function getScrapeOpsUrl(url) {
    const payload = {
        api_key: API_KEY,
        url: url,
        keep_headers: true
    };
    const proxyUrl = 'https://proxy.scrapeops.io/v1/?' + querystring.stringify(payload);
    return proxyUrl;
}
class Upcloud extends types_1.Provider {
    constructor() {
        super(...arguments);
        this.baseUrl = "https://vidsrc.cc/";
        this.headers = {
            Referer: this.baseUrl,
            "X-Requested-With": "XMLHttpRequest",
            "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/129.0.0.0 Safari/537.36",
        };
    }
    getSource(id, isMovie, season, episode) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const mediaurl = this.baseUrl +
                    "v2/embed/" +
                    (isMovie ? `movie/${id}` : `tv/${id}/${season}/${episode}`);
                console.log(mediaurl);
                const mediaInfo = yield axios_1.default.get(mediaurl, {
                    headers: Object.assign(Object.assign({}, this.headers), { Accept: "text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,*/*;q=0.8", Connection: "keep-alive", "Sec-Fetch-Dest": "document" }),
                });
                const mediaData = yield mediaInfo.data;
                const title = mediaData.match(/<title>(.*?)<\/title>/)[1];
                const movieId = mediaData.match(/data-id="(.*?)"/g)[1].split('"')[1];
                const v = mediaData.match(/var\s*v\s*=\s*"(.*?)"/)[1];
                const params = new URLSearchParams(Object.assign({ id: String(id), type: isMovie ? "movie" : "tv", v: String(v), vrf: "uwu", isMobile: "false" }, (isMovie
                    ? {}
                    : { season: String(season), episode: String(episode) })));
                console.log(this.baseUrl + `api/episodes/${id}/servers?${params}`);
                var { data } = yield (yield axios_1.default.get(this.baseUrl + `api/episodes/${id}/servers?${params}`, {
                    headers: this.headers,
                })).data;
                let hash = data.find((source) => source.name === "UpCloud").hash;
                console.log(this.baseUrl + "api/source/" + hash, Object.assign(Object.assign({}, this.headers), { Referer: `${this.baseUrl}upcloud/e/${hash}?init=true&key=${v}` }));
                const source = yield (yield axios_1.default.get(this.baseUrl + "api/source/" + hash, {
                    headers: Object.assign(Object.assign({}, this.headers), { Referer: `${this.baseUrl}upcloud/e/${hash}?init=true&key=${v}` }),
                })).data;
                console.log(source);
                // return title;
                return Object.assign({ title }, source);
            }
            catch (error) {
                console.log("faild ", error);
                throw error;
            }
        });
    }
}
exports.default = Upcloud;
// faild  TypeError: Cannot read properties of null (reading '1')
//     at <anonymous> (/vercel/path1/src/vidsrc.ts:28:38)
//     at process.processTicksAndRejections (node:internal/process/task_queues:95:5)
