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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.fetchMovieData = fetchMovieData;
exports.fetchTVData = fetchTVData;
const axios_1 = __importDefault(require("axios"));
const api_constants_1 = require("../constants/api_constants");
function fetchMovieData(id) {
    return __awaiter(this, void 0, void 0, function* () {
        const key = `tmdb-movie:${id}`;
        const fetchData = () => __awaiter(this, void 0, void 0, function* () {
            const apiFindData = `${api_constants_1.tmdbBaseUrl}/3/find/${id}?language=en-US&api_key=${api_constants_1.tmdbKey}&external_source=imdb_id`;
            try {
                const responseFind = yield axios_1.default.get(apiFindData);
                var tmdbId = responseFind.data.movie_results[0].id;
                const apiUrl = `${api_constants_1.tmdbBaseUrl}/3/movie/${tmdbId}?language=en-US&api_key=${api_constants_1.tmdbKey}&external_source=imdb_id`;
                const response = yield axios_1.default.get(apiUrl);
                const releaseDate = response.data.release_date;
                const title = response.data.title;
                const year = parseInt(releaseDate.split("-")[0]);
                const dataToCache = { title, year };
                return dataToCache;
            }
            catch (error) {
                throw new Error("Error fetching TMDB data:," + error);
            }
        });
        return yield fetchData();
    });
}
function fetchTVData(id, seasonNum, episodeNum) {
    return __awaiter(this, void 0, void 0, function* () {
        const key = `tmdb-tv:${id}:${episodeNum}:${seasonNum}`;
        const fetchData = () => __awaiter(this, void 0, void 0, function* () {
            try {
                const apiFindData = `${api_constants_1.tmdbBaseUrl}/3/find/${id}?language=en-US&api_key=${api_constants_1.tmdbKey}&external_source=imdb_id`;
                const responseFind = yield axios_1.default.get(apiFindData);
                var tmdbId = responseFind.data.tv_results[0].id;
                const apiUrlSeason = `${api_constants_1.tmdbBaseUrl}/3/tv/${tmdbId}/season/${seasonNum}?language=en-US&api_key=${api_constants_1.tmdbKey}&external_source=imdb_id`;
                const response = yield axios_1.default.get(apiUrlSeason);
                const resposneGeneral = yield fetchTVPrimaryData(tmdbId);
                const episodes = response.data.episodes;
                const seasonId = response.data.id;
                const title = resposneGeneral.title;
                const year = resposneGeneral === null || resposneGeneral === void 0 ? void 0 : resposneGeneral.year;
                const numberOfSeasons = resposneGeneral === null || resposneGeneral === void 0 ? void 0 : resposneGeneral.numberOfSeasons;
                const episodeIndex = parseInt(episodeNum) - 1;
                if (episodeIndex >= 0 && episodeIndex < episodes.length) {
                    const { id: episodeId } = episodes[episodeIndex];
                    const dataToCache = {
                        title,
                        episodeId,
                        seasonId,
                        year,
                        numberOfSeasons,
                    };
                    return dataToCache;
                }
                else {
                    throw new Error("Invalid episode number");
                }
            }
            catch (error) {
                throw new Error("Error fetching TMDB data:," + error);
            }
        });
        return yield fetchData();
    });
}
function fetchTVPrimaryData(id) {
    return __awaiter(this, void 0, void 0, function* () {
        const key = `tmdb-tv-info:${id}`;
        const fetchTVData = () => __awaiter(this, void 0, void 0, function* () {
            try {
                const apiUrlGeneral = `${api_constants_1.tmdbBaseUrl}/3/tv/${id}?language=en-US&api_key=${api_constants_1.tmdbKey}&external_source=imdb_id`;
                const resposneGeneral = yield axios_1.default.get(apiUrlGeneral);
                const title = resposneGeneral.data.name;
                const year = parseInt(resposneGeneral.data.first_air_date.split("-")[0]);
                const numberOfSeasons = resposneGeneral.data.number_of_seasons;
                const dataToCache = {
                    title,
                    year,
                    numberOfSeasons,
                };
                return dataToCache;
            }
            catch (error) {
                throw new Error("Error fetching TMDB data:," + error);
            }
        });
        return fetchTVData();
    });
}
