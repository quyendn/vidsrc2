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
exports.hubcloudExtracter = hubcloudExtracter;
const axios_1 = __importDefault(require("axios"));
const cheerio = __importStar(require("cheerio"));
const headers_1 = require("./headers");
const decode = function (value) {
    if (value === undefined) {
        return '';
    }
    return atob(value.toString());
};
function hubcloudExtracter(link) {
    return __awaiter(this, void 0, void 0, function* () {
        var _a, _b, _c, _d, _e;
        try {
            console.log('hubcloudExtracter', link);
            const streamLinks = [];
            const vLinkRes = yield (0, axios_1.default)(`${link}`, { headers: headers_1.headers });
            const vLinkText = vLinkRes.data;
            const vLinkRedirect = vLinkText.match(/var\s+url\s*=\s*'([^']+)';/) || [];
            const vcloudLink = decode((_b = (_a = vLinkRedirect[1]) === null || _a === void 0 ? void 0 : _a.split('r=')) === null || _b === void 0 ? void 0 : _b[1]) || vLinkRedirect[1] || link;
            console.log('vcloudLink', vcloudLink);
            const vcloudRes = yield fetch(vcloudLink, {
                headers: headers_1.headers,
                redirect: 'follow',
            });
            const $ = cheerio.load(yield vcloudRes.text());
            const linkClass = $('.btn-success.btn-lg.h6,.btn-danger,.btn-secondary');
            for (const element of linkClass) {
                const itm = $(element);
                let link = itm.attr('href') || '';
                if ((link === null || link === void 0 ? void 0 : link.includes('.dev')) && !(link === null || link === void 0 ? void 0 : link.includes('/?id='))) {
                    streamLinks.push({ server: 'Cf Worker', link: link, type: 'mkv', subtitles: [] });
                }
                if (link === null || link === void 0 ? void 0 : link.includes('pixel')) {
                    if (!(link === null || link === void 0 ? void 0 : link.includes('api'))) {
                        const token = link.split('/').pop();
                        const baseUrl = link.split('/').slice(0, -2).join('/');
                        link = `${baseUrl}/api/file/${token}?download`;
                    }
                    streamLinks.push({ server: 'pixeldrain', link: link, type: 'mkv', subtitles: [] });
                }
                if ((link === null || link === void 0 ? void 0 : link.includes('hubcloud')) || (link === null || link === void 0 ? void 0 : link.includes('/?id='))) {
                    const newLinkRes = yield axios_1.default.head(link, { headers: headers_1.headers });
                    const newLink = ((_e = (_d = (_c = newLinkRes.request) === null || _c === void 0 ? void 0 : _c.responseURL) === null || _d === void 0 ? void 0 : _d.split('link=')) === null || _e === void 0 ? void 0 : _e[1]) || link;
                    streamLinks.push({ server: 'hubcloud', link: newLink, type: 'mkv', subtitles: [] });
                }
                if (link === null || link === void 0 ? void 0 : link.includes('cloudflarestorage')) {
                    streamLinks.push({ server: 'CfStorage', link: link, type: 'mkv', subtitles: [] });
                }
            }
            return streamLinks;
        }
        catch (error) {
            console.log('hubcloudExtracter error: ', error);
            return [];
        }
    });
}
