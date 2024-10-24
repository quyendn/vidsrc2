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
class AutoEmbed extends types_1.Provider {
    constructor() {
        super(...arguments);
        this.getSource = (id, isMovie, season, episode) => __awaiter(this, void 0, void 0, function* () {
            let type = "tv";
            if (isMovie) {
                type = "movie";
            }
            let info = JSON.stringify({
                imdbId: id,
                season: season || "0",
                episode: episode || "0",
                tmdbId: id
            });
            let episodeX = yield Manifest_1.manifest["autoEmbed"].GetStream(info, type);
            console.log("episodeX:" + episodeX);
            return episodeX;
        });
    }
}
exports.default = AutoEmbed;
