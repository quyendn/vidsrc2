"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.manifest = void 0;
const netflixMirror_1 = require("./providers/netflixMirror");
const autoEmbed_1 = require("./providers/autoEmbed");
const drive_1 = require("./providers/drive");
const moviesApi_1 = require("./providers/moviesApi");
const multi_1 = require("./providers/multi");
exports.manifest = {
    netflixMirror: netflixMirror_1.netflixMirror,
    autoEmbed: autoEmbed_1.autoEmbed,
    moviesDrive: drive_1.moviesDrive,
    moviesApi: moviesApi_1.moviesApi,
    multiMovies: multi_1.multiMovies
};
