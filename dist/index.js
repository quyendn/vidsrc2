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
const express_1 = __importDefault(require("express"));
const upcloud_1 = __importDefault(require("./extractors/upcloud"));
const vidsrcNet_1 = __importDefault(require("./extractors/vidsrcNet"));
const vidlink_1 = __importDefault(require("./extractors/vidlink"));
const vidsrc_xyz_1 = require("./extractors/vidsrc.xyz");
const vidsrc_decode_1 = require("./extractors/vidsrc.decode");
const hdrezka_1 = __importDefault(require("./extractors/hdrezka"));
const iosmirror_1 = __importDefault(require("./extractors/iosmirror"));
const chalk_1 = __importDefault(require("chalk"));
const autoembed_1 = __importDefault(require("./extractors/autoembed"));
const moviesDrive_1 = __importDefault(require("./extractors/moviesDrive"));
const moviesApi_1 = __importDefault(require("./extractors/moviesApi"));
const cors = require("cors");
const app = (0, express_1.default)();
const PORT = 8080;
// Middleware to parse JSON requests
app.use(express_1.default.json());
app.use(cors());
// Sample data (could be replaced with a database)
let items = [];
app.use((req, res, next) => {
    res.setHeader("Access-Control-Allow-Origin", "*");
    res.setHeader("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
    next();
});
app.get("/", (req, res) => {
    res.status(200).send("Welcome to FlixQuest API! 🎉");
});
// GET route to fetch items
app.get("/autoEmbed/watch", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    res.setHeader("Content-Type", "application/json");
    let src;
    const autoEmbed = new autoembed_1.default();
    try {
        const id = req.query.id;
        const isMovie = req.query.isMovie == "true";
        if (!isMovie) {
            const season = req.query.season;
            const episode = req.query.episode;
            console.log(id, isMovie, episode, season);
            src = yield autoEmbed.getSource(id === null || id === void 0 ? void 0 : id.toString(), isMovie, season === null || season === void 0 ? void 0 : season.toString(), episode === null || episode === void 0 ? void 0 : episode.toString());
        }
        else {
            src = yield autoEmbed.getSource(id === null || id === void 0 ? void 0 : id.toString(), isMovie);
        }
        res.json(src);
    }
    catch (error) {
        console.log("faild ", error);
        res.send(error);
    }
}));
app.get("/moviesApi/watch", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    res.setHeader("Content-Type", "application/json");
    let src;
    const moviesAPI = new moviesApi_1.default();
    try {
        const id = req.query.id;
        const isMovie = req.query.isMovie == "true";
        if (!isMovie) {
            const season = req.query.season;
            const episode = req.query.episode;
            console.log(id, isMovie, episode, season);
            src = yield moviesAPI.getSource(id === null || id === void 0 ? void 0 : id.toString(), isMovie, season === null || season === void 0 ? void 0 : season.toString(), episode === null || episode === void 0 ? void 0 : episode.toString());
        }
        else {
            src = yield moviesAPI.getSource(id === null || id === void 0 ? void 0 : id.toString(), isMovie);
        }
        res.json(src);
    }
    catch (error) {
        console.log("faild ", error);
        res.send(error);
    }
}));
app.get("/moviesDrive/watch", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    res.setHeader("Content-Type", "application/json");
    let src;
    const movieDrive = new moviesDrive_1.default();
    try {
        const id = req.query.id;
        const isMovie = req.query.isMovie == "true";
        if (!isMovie) {
            const season = req.query.season;
            const episode = req.query.episode;
            console.log(id, isMovie, episode, season);
            src = yield movieDrive.getSource(id === null || id === void 0 ? void 0 : id.toString(), isMovie, season === null || season === void 0 ? void 0 : season.toString(), episode === null || episode === void 0 ? void 0 : episode.toString());
        }
        else {
            src = yield movieDrive.getSource(id === null || id === void 0 ? void 0 : id.toString(), isMovie);
        }
        res.json(src);
    }
    catch (error) {
        console.log("faild ", error);
        res.send(error);
    }
}));
app.get("/iosmirror/watch", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    res.setHeader("Content-Type", "application/json");
    let src;
    const iosmirror = new iosmirror_1.default();
    try {
        const id = req.query.id;
        const isMovie = req.query.isMovie == "true";
        if (!isMovie) {
            const season = req.query.season;
            const episode = req.query.episode;
            console.log(id, isMovie, episode, season);
            src = yield iosmirror.getSource(id === null || id === void 0 ? void 0 : id.toString(), isMovie, season === null || season === void 0 ? void 0 : season.toString(), episode === null || episode === void 0 ? void 0 : episode.toString());
        }
        else {
            src = yield iosmirror.getSource(id === null || id === void 0 ? void 0 : id.toString(), isMovie);
        }
        res.json(src);
    }
    catch (error) {
        console.log("faild ", error);
        res.send(error);
    }
}));
app.get("/upcloud/watch", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    res.setHeader("Content-Type", "application/json");
    let src;
    const upcloud = new upcloud_1.default();
    try {
        const id = req.query.id;
        const isMovie = req.query.isMovie == "true";
        if (!isMovie) {
            const season = req.query.season;
            const episode = req.query.episode;
            console.log(id, isMovie, episode, season);
            src = yield upcloud.getSource(id === null || id === void 0 ? void 0 : id.toString(), isMovie, season === null || season === void 0 ? void 0 : season.toString(), episode === null || episode === void 0 ? void 0 : episode.toString());
        }
        else {
            src = yield upcloud.getSource(id === null || id === void 0 ? void 0 : id.toString(), isMovie);
        }
        res.json(src);
    }
    catch (error) {
        console.log("faild ", error);
        res.send(error);
    }
}));
app.get("/hdrezka/watch", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    res.setHeader("Content-Type", "application/json");
    let src;
    const hdrezka = new hdrezka_1.default();
    try {
        const id = req.query.id;
        const isMovie = req.query.isMovie == "true";
        if (!isMovie) {
            const season = req.query.season;
            const episode = req.query.episode;
            console.log(id, isMovie, episode, season);
            src = yield hdrezka.getSource(id === null || id === void 0 ? void 0 : id.toString(), isMovie, season === null || season === void 0 ? void 0 : season.toString(), episode === null || episode === void 0 ? void 0 : episode.toString());
        }
        else {
            src = yield hdrezka.getSource(id === null || id === void 0 ? void 0 : id.toString(), isMovie);
        }
        res.json(src);
    }
    catch (error) {
        console.log("faild ", error);
        res.send(error);
    }
}));
app.get("/vidsrc/watch", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    res.setHeader("Content-Type", "application/json");
    let src;
    const vidsrc = new vidsrcNet_1.default();
    try {
        const id = req.query.id;
        const isMovie = req.query.isMovie == "true";
        if (!isMovie) {
            const season = req.query.season;
            const episode = req.query.episode;
            console.log(id, isMovie, episode, season);
            src = yield vidsrc.getSource(id === null || id === void 0 ? void 0 : id.toString(), isMovie, season === null || season === void 0 ? void 0 : season.toString(), episode === null || episode === void 0 ? void 0 : episode.toString());
        }
        else {
            src = yield vidsrc.getSource(id === null || id === void 0 ? void 0 : id.toString(), isMovie);
        }
        res.json(src);
    }
    catch (error) {
        console.log("faild ", error);
        res.send(error);
    }
}));
app.get("/vidlink/watch", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    res.setHeader("Content-Type", "application/json");
    let src;
    const vidsrc = new vidlink_1.default();
    try {
        const id = req.query.id;
        const isMovie = req.query.isMovie == "true";
        if (!isMovie) {
            const season = req.query.season;
            const episode = req.query.episode;
            console.log(id, isMovie, episode, season);
            src = yield vidsrc.getSource(id === null || id === void 0 ? void 0 : id.toString(), isMovie, season === null || season === void 0 ? void 0 : season.toString(), episode === null || episode === void 0 ? void 0 : episode.toString());
        }
        else {
            src = yield vidsrc.getSource(id === null || id === void 0 ? void 0 : id.toString(), isMovie);
        }
        res.json(src);
    }
    catch (error) {
        console.log("faild ", error);
        res.send(error);
    }
}));
app.get("/vidsrcin/:id", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { id } = req.params;
        const s = req.query.s;
        const e = req.query.e;
        const result = yield (0, vidsrc_xyz_1.mainVidSrc)(id, s, e);
        console.log("result from vidsrcpro: ", result);
        res.json(result);
    }
    catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Internal server error vidsrc.me' });
    }
}));
app.get("/vidsrcx/:id", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const src_link = req.query.src_link;
        const rcp_link = req.query.rcp_link;
        const result = yield (0, vidsrc_decode_1.decodeVidSrc)(src_link, rcp_link);
        console.log("result from vidsrcx: ", result);
        res.json(result);
    }
    catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Internal server error vidsrc.me' });
    }
}));
app.listen(PORT, () => {
    console.log(chalk_1.default.green(`Starting server on port ${PORT}... 🚀`));
    console.log(`Server is running on http://localhost:${PORT}`);
});
