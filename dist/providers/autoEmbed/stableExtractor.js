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
exports.stableExtractor = stableExtractor;
function stableExtractor(url) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            // console.log('stableExtractorUrl', url);
            const links = [];
            const res = yield fetch(url);
            const html = yield res.text();
            // console.log('stableExtractorHtml', html);
            const regex = /file:\s*"([^"]+)"/;
            const match = regex.exec(html);
            if (match) {
                const [, url] = match;
                links.push({ lang: '', url });
            }
            // console.log('stableExtractor', links);
            return links;
        }
        catch (err) {
            console.error('stableExtractor', err);
            return [];
        }
    });
}
