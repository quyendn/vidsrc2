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
exports.getFlimxyStream = void 0;
const getFlimxyStream = (imdbId, season, episode, type) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    try {
        const baseUrl = atob('aHR0cHM6Ly9maWxteHkud2FmZmxlaGFja2VyLmlvLw==');
        const controller = new AbortController();
        setTimeout(() => {
            controller.abort();
        }, 4000);
        const filter = type === 'movie'
            ? `search?id=${imdbId}`
            : `search?id=${imdbId}&s=${season}&e=${episode}`;
        const url = `${baseUrl}${filter}`;
        console.log('flimxy url', url);
        const res = yield fetch(url, { signal: controller.signal });
        const data = yield res.json();
        return (_a = data === null || data === void 0 ? void 0 : data.stream) === null || _a === void 0 ? void 0 : _a[0];
    }
    catch (e) {
        console.log('getFlimxyStream error', e);
    }
});
exports.getFlimxyStream = getFlimxyStream;
