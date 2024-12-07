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
exports.multiGetStream = void 0;
const axios_1 = __importDefault(require("axios"));
const cheerio = __importStar(require("cheerio"));
const headers_1 = require("./headers");
const multiGetStream = (url, type) => __awaiter(void 0, void 0, void 0, function* () {
    var _a, _b, _c, _d;
    try {
        const res = yield axios_1.default.get(url, { headers: headers_1.headers });
        const html = res.data;
        const $ = cheerio.load(html);
        const streamLinks = [];
        const postId = $('#player-option-1').attr('data-post');
        const nume = $('#player-option-1').attr('data-nume');
        const typeValue = $('#player-option-1').attr('data-type');
        const baseUrl = url.split('/').slice(0, 3).join('/');
        console.log('baseUrl', baseUrl);
        if (!postId || !nume || !typeValue) {
            throw new Error('Required data attributes are missing.');
        }
        const formData = new FormData();
        formData.append('action', 'doo_player_ajax');
        formData.append('post', postId);
        formData.append('nume', nume);
        formData.append('type', typeValue);
        console.log('formData', formData);
        const playerRes = yield fetch(`${baseUrl}/wp-admin/admin-ajax.php`, {
            headers: headers_1.headers,
            body: formData,
            method: 'POST',
        });
        const playerData = yield playerRes.json();
        console.log('playerData', playerData);
        let ifameUrl = ((_b = (_a = playerData === null || playerData === void 0 ? void 0 : playerData.embed_url) === null || _a === void 0 ? void 0 : _a.match(/<iframe[^>]+src="([^"]+)"[^>]*>/i)) === null || _b === void 0 ? void 0 : _b[1]) ||
            (playerData === null || playerData === void 0 ? void 0 : playerData.embed_url);
        console.log('ifameUrl', ifameUrl);
        if (!ifameUrl.includes('multimovies')) {
            const iframeRes = yield axios_1.default.get(ifameUrl, { headers: headers_1.headers });
            // console.log('iframeRes', iframeRes.data);
            const $$ = cheerio.load(iframeRes.data);
            let newIframeUrl = $$('.linkserver').first().attr('data-video') ||
                $$('#videoLinks').children().first().attr('data-link');
            console.log('newIframeUrl', newIframeUrl);
            if (newIframeUrl) {
                ifameUrl = newIframeUrl;
            }
        }
        const iframeRes = yield axios_1.default.get(ifameUrl, { headers: headers_1.headers });
        const iframeData = iframeRes.data;
        // Step 1: Extract the function parameters and the encoded string
        var functionRegex = /eval\(function\((.*?)\)\{.*?return p\}.*?\('(.*?)'\.split/;
        var match = functionRegex.exec(iframeData);
        let p = '';
        if (match) {
            var params = match[1].split(',').map(param => param.trim());
            var encodedString = match[2];
            // console.log('Parameters:', params);
            // console.log('Encoded String:', encodedString.split("',36,")[0], '🔥🔥');
            p = (_c = encodedString.split("',36,")) === null || _c === void 0 ? void 0 : _c[0].trim();
            let a = 36;
            let c = encodedString.split("',36,")[1].slice(2).split('|').length;
            let k = encodedString.split("',36,")[1].slice(2).split('|');
            while (c--) {
                if (k[c]) {
                    var regex = new RegExp('\\b' + c.toString(a) + '\\b', 'g');
                    p = p.replace(regex, k[c]);
                }
            }
            // console.log('Decoded String:', p);
        }
        else {
            console.log('No match found');
        }
        const streamUrl = (_d = p === null || p === void 0 ? void 0 : p.match(/file:\s*"([^"]+\.m3u8[^"]*)"/)) === null || _d === void 0 ? void 0 : _d[1];
        console.log('streamUrl', streamUrl);
        console.log('newUrl', streamUrl === null || streamUrl === void 0 ? void 0 : streamUrl.replace(/&i=\d+,'\.4&/, '&i=0.4&'));
        if (streamUrl) {
            streamLinks.push({
                server: 'Multi',
                link: streamUrl.replace(/&i=\d+,'\.4&/, '&i=0.4&'),
                type: 'm3u8',
                subtitles: [],
            });
        }
        return streamLinks;
    }
    catch (err) {
        console.error(err);
        return [];
    }
});
exports.multiGetStream = multiGetStream;
