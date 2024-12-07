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
exports.getRiveStream = getRiveStream;
exports.generateSecretKey = generateSecretKey;
const axios_1 = __importDefault(require("axios"));
const getBaseUrl_1 = require("../../utils/getBaseUrl");
function getRiveStream(tmdId, episode, season, type, Streams) {
    return __awaiter(this, void 0, void 0, function* () {
        const secret = generateSecretKey(Number(tmdId));
        const servers = [
            'hydrax',
            'filmecho',
            'upcloud',
            'nova',
            'vidcloud',
            'ee3',
            'filmxyz',
        ];
        const baseUrl = yield (0, getBaseUrl_1.getBaseUrl)('rive');
        const cors = 'aHR0cHM6Ly9jcnMuMXByb3h5LndvcmtlcnMuZGV2Lz91cmw9';
        const route = type === 'series'
            ? `/api/backendfetch?requestID=tvVideoProvider&id=${tmdId}&season=${season}&episode=${episode}&secretKey=${secret}&service=`
            : `/api/backendfetch?requestID=movieVideoProvider&id=${tmdId}&secretKey=${secret}&service=`;
        const url = atob(cors) + encodeURIComponent(baseUrl + route);
        yield Promise.all(servers.map((server) => __awaiter(this, void 0, void 0, function* () {
            var _a, _b, _c, _d, _e, _f, _g, _h;
            console.log('Rive: ' + url + server);
            try {
                const res = yield axios_1.default.get(url + server, { timeout: 4000 });
                console.log('Rive Stream: ' + url + server);
                const subtitles = [];
                if ((_b = (_a = res.data) === null || _a === void 0 ? void 0 : _a.data) === null || _b === void 0 ? void 0 : _b.captions) {
                    (_d = (_c = res.data) === null || _c === void 0 ? void 0 : _c.data) === null || _d === void 0 ? void 0 : _d.captions.forEach((sub) => {
                        var _a;
                        subtitles.push({
                            language: ((_a = sub === null || sub === void 0 ? void 0 : sub.label) === null || _a === void 0 ? void 0 : _a.slice(0, 2)) || 'Und',
                            uri: sub === null || sub === void 0 ? void 0 : sub.file,
                            title: (sub === null || sub === void 0 ? void 0 : sub.label) || 'Undefined',
                            type: ".vtt"
                        });
                    });
                }
                console.log('Rive res: ', (_f = (_e = res.data) === null || _e === void 0 ? void 0 : _e.data) === null || _f === void 0 ? void 0 : _f.sources);
                (_h = (_g = res.data) === null || _g === void 0 ? void 0 : _g.data) === null || _h === void 0 ? void 0 : _h.sources.forEach((source) => {
                    Streams.push({
                        server: (source === null || source === void 0 ? void 0 : source.source) + '-' + (source === null || source === void 0 ? void 0 : source.quality),
                        link: source === null || source === void 0 ? void 0 : source.url,
                        type: (source === null || source === void 0 ? void 0 : source.format) === 'hls' ? 'm3u8' : 'mp4',
                        quality: source === null || source === void 0 ? void 0 : source.quality,
                        subtitles: subtitles,
                    });
                });
            }
            catch (e) {
                console.log(e);
            }
        })));
    });
}
// The two arrays used in key generation
const u = [
    'D0G31EK54',
    '0vwtC',
    'evM2jk',
    'KE4nt7LQxI',
    'Y6VBqEMmu',
    '0uwcxC7b',
    'X25Fcc',
    'lhwA3NQJX',
    'UFFQPgYD',
    'FGKgLaVsi',
    'q9lOrp',
    'ITrWAb',
    'DexH4FG9',
    'mF5ax0',
    'O3OHy5To',
    'VXrxDC8iVA',
    'oqJ2ncnyl',
    'YICvj9lbu6',
    'GAJGmOTC',
    'O5AYHZO',
    'FAnry5Oi',
    'UH585HY',
    'hPnHeR',
    'HnsKLNZiU',
    'dAWyV42NI',
    'WlaLe57sT',
    'qv1GGA4ZWd',
    'ajS3vkQ',
    '8dktWPYp',
    'n1DHcQWq',
    'zKScZgxbas',
    '7WP5qZrx',
    'KFSPp8W6UK',
    'ON0Gm',
    'nf3Jm',
    'eOJ49mY',
    'bAoo3v',
    'y0RraCS1TS',
    'xeUce',
    'EtuFJ63',
    'ydB3UlP3',
    'BcNhJEpwW',
    'wxn4ZoS6w',
    'Y34Jcz',
    '0v58PuP',
    'PAsuN',
    '4qvwGFL7pX',
    'bIELEk',
    'cYa7Xq',
    'IXvEKywghM',
];
const c = [
    'N',
    '1y',
    'R',
    'efH',
    'bR',
    'CY',
    'HF',
    'JL',
    '5',
    'A',
    'mh',
    '4',
    'F7g',
    'GzH',
    '7cb',
    'gfg',
    'f',
    'Q',
    '8',
    'c',
    'YP',
    'I',
    'KL',
    'CzW',
    'YTL',
    '4',
    'u',
    '3',
    'Vlg',
    '9q',
    'NzG',
    '9CK',
    'AbS',
    'jUG',
    'Fd',
    'c3S',
    'VWx',
    'wp',
    'bgx',
    'V',
    'o1H',
    'Pa',
    'yk',
    'a',
    'KJ',
    'VnV',
    'O',
    'm',
    'ihF',
    'x',
];
function generateSecretKey(optionalId) {
    // Get current UTC date components
    let date = new Date();
    date.getUTCHours(); // This is called in the original code but not used
    let day = date.getUTCDate();
    let month = date.getUTCMonth();
    let year = date.getUTCFullYear();
    // Generate the key
    // If optionalId is provided, use it for the first part, otherwise use the day
    let firstPart = optionalId !== undefined ? c[optionalId % c.length] : c[day % c.length];
    return (firstPart + u[day % u.length] + u[month % u.length] + u[year % u.length]);
}
