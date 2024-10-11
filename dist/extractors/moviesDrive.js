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
class moviesDrive extends types_1.Provider {
    constructor() {
        super(...arguments);
        this.getSource = (id, isMovie, season, episode) => __awaiter(this, void 0, void 0, function* () {
            let info = '{"imdbId" : "tt1877830", "season" : 0, "episode": "0", "title" : "The Batman", "tmdbId": "414906", "year" : "2022"}';
            //let episodeX = await  manifest["moviesDrive"].GetSearchPosts("The Batman",1,"moviesDrive");
            //let movieInfo = await  manifest["moviesDrive"].GetMetaData(episodeX[0].link,"moviesDrive");
            let movieLink = yield Manifest_1.manifest["moviesDrive"].GetStream("https://mdrive.site/archives/16160", "movie");
            console.log("movieLink:" + movieLink);
            return movieLink;
        });
    }
}
exports.default = moviesDrive;
