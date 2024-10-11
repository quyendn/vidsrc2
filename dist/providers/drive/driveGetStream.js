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
exports.driveGetStream = void 0;
const axios_1 = __importDefault(require("axios"));
const cheerio = __importStar(require("cheerio"));
const querystring = __importStar(require("querystring"));
const header_1 = require("./header");
const hubcloudExtractor_1 = require("../hubcloudExtractor");
const API_KEY = '85f31af1-9be8-4122-8c0d-06f502e51d5c';
const driveGetStream = (url, type) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        if (type === 'movie') {
            const res = yield axios_1.default.get(url, { headers: header_1.headers });
            const html = res.data;
            const $ = cheerio.load(html);
            const link = $('a:contains("HubCloud")').attr('href');
            url = link || url;
        }
        console.log('driveGetStream', type, url);
        const res = yield axios_1.default.get(url, { headers: header_1.headers });
        const redirectUrl = res.data.match(/<meta\s+http-equiv="refresh"\s+content="[^"]*?;\s*url=([^"]+)"\s*\/?>/i)[1];
        console.log('redirectUrl', redirectUrl);
        let redirectUrlProxy = "https://proxy.wafflehacker.io/?destination=" + redirectUrl;
        const res2 = yield axios_1.default.get(getScrapeOpsUrl(redirectUrl), {
            headers: header_1.headers
        });
        const data = res2.data;
        console.log('data', data);
        const $ = cheerio.load(data);
        const hubcloudLink = $('.fa-file-download').parent().attr('href');
        console.log('hubcloudLink', hubcloudLink);
        return yield (0, hubcloudExtractor_1.hubcloudExtracter)(hubcloudLink);
    }
    catch (err) {
        console.error(err);
        return [];
    }
});
exports.driveGetStream = driveGetStream;
function getScrapeOpsUrl(url) {
    const payload = {
        api_key: API_KEY,
        url: url,
        keep_headers: true
    };
    const proxyUrl = 'https://proxy.scrapeops.io/v1/?' + querystring.stringify(payload);
    return proxyUrl;
}
