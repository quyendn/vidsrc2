"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.manifest = void 0;
const netflixMirror_1 = require("./providers/netflixMirror");
const autoEmbed_1 = require("./providers/autoEmbed");
const drive_1 = require("./providers/drive");
exports.manifest = {
    netflixMirror: netflixMirror_1.netflixMirror,
    autoEmbed: autoEmbed_1.autoEmbed,
    moviesDrive: drive_1.moviesDrive
};
