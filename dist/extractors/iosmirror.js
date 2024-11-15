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
const Manifest_1 = require("../Manifest");
const types_1 = require("../utils/types");
const function_1 = require("../utils/function");
class Iosmirror extends types_1.Provider {
    constructor() {
        super(...arguments);
        this.getSource = (tmdbId, isMovie, season, episode) => __awaiter(this, void 0, void 0, function* () {
            let info;
            let releaseYear = "";
            let title = "";
            if (isMovie) {
                yield (0, function_1.fetchMovieData)(tmdbId).then((data) => {
                    if (data) {
                        releaseYear = data === null || data === void 0 ? void 0 : data.year.toString();
                        title = data === null || data === void 0 ? void 0 : data.title;
                    }
                });
            }
            const controller = new AbortController();
            console.log("title:" + title);
            info = yield Manifest_1.manifest["netflixMirror"].GetSearchPosts(title, 1, "netflixMirror", controller.signal);
            let linkURL = info[0].link;
            console.log("linkURL:" + linkURL);
            let metaData = yield Manifest_1.manifest["netflixMirror"].GetMetaData(linkURL, "netflixMirror");
            console.log("metaData:" + metaData);
            let episodeX = yield Manifest_1.manifest["netflixMirror"].GetStream(metaData.id, "movie");
            console.log("episodeX:" + episodeX);
            return episodeX;
        });
    }
}
exports.default = Iosmirror;
