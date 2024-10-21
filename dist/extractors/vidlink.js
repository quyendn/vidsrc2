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
const crypto_1 = __importDefault(require("crypto"));
const types_1 = require("../utils/types");
const axios_1 = __importDefault(require("axios"));
const cheerio_1 = require("cheerio");
class Vidlink extends types_1.Provider {
    constructor() {
        super(...arguments);
        this.baseURL = "https://vidlink.pro/api/";
        this.key = Buffer.from("81060e6a859466b13871d1eeeae166d54d42cf3ea20cc87194a94ff6c3ec845c", "hex");
        this.algorithm = "aes-256-cbc";
        this._cryptoMethods = {
            encodeID: (data) => {
                let iv = crypto_1.default.randomBytes(16);
                console.log(iv.buffer);
                let cipher = crypto_1.default.createCipheriv(this.algorithm, this.key, "");
                let encrypted = Buffer.concat([
                    cipher.update(data, "utf8"),
                    cipher.final(),
                ]);
                return iv.toString("hex") + ":" + encrypted.toString("hex");
            },
            decodeID: (encrypted) => {
                let parts = encrypted.split(":");
                let iv = Buffer.from(parts.shift(), "hex");
                let encryptedText = Buffer.from(parts.join(":"), "hex");
                let decipher = crypto_1.default.createDecipheriv(this.algorithm, this.key, iv);
                let decrypted = Buffer.concat([
                    decipher.update(encryptedText),
                    decipher.final(),
                ]);
                return decrypted.toString();
            },
            decrypt: (encrypted) => {
                let parts = encrypted.split(":");
                let iv = Buffer.from(parts.shift(), "hex");
                let encryptedText = Buffer.from(parts.join(":"), "hex");
                let decipher = crypto_1.default.createDecipheriv(this.algorithm, this.key, iv);
                let decrypted = Buffer.concat([
                    decipher.update(encryptedText),
                    decipher.final(),
                ]);
                return decrypted.toString();
            },
        };
        this.getSource = (id, isMovie, season, episode) => __awaiter(this, void 0, void 0, function* () {
            const DOMAIN = "https://vidlink.pro";
            const headers = {
                'user-agent': "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/124.0.0.0 Safari/537.36",
                'Referer': "https://vidlink.pro/",
                'Origin': DOMAIN,
            };
            let urlEmbed = `${DOMAIN}/tv/${id}/${season}/${episode}`;
            if (isMovie) {
                urlEmbed = `${DOMAIN}/movie/${id}`;
            }
            const controller = new AbortController();
            setTimeout(() => {
                controller.abort();
            }, 4000);
            const resSearch = yield axios_1.default.get(urlEmbed, {
                headers: headers,
                signal: controller.signal,
                method: 'GET'
            });
            const parseEmbed = (0, cheerio_1.load)(resSearch.data);
            const scripts = [];
            parseEmbed("script").each((key, item) => {
                const scriptData = parseEmbed(item).attr("src");
                if (scriptData && scriptData.indexOf("/page-") !== -1) {
                    scripts.push(`${DOMAIN}${scriptData}`);
                }
            });
            let KEY = "";
            for (let item of scripts) {
                const scriptData = yield fetch(item);
                const textData = yield scriptData.text();
                let matchKey = textData.match(/\, *i *\= *\"([^\"]+)/i);
                let matchKeyText = matchKey ? matchKey[1] : "";
                if (matchKeyText) {
                    KEY = matchKeyText;
                }
            }
            console.log("KEY: " + KEY);
            const hash = yield (yield fetch(`https://aquariumtv.app/encrypt?id=${id}&key=${KEY}`)).text();
            console.log("HASH: " + hash);
            let urlSearch = `${DOMAIN}/api/tv/${hash}/${season}/${episode}?multiLang=0`;
            if (isMovie) {
                urlSearch = `${DOMAIN}/api/movie/${hash}?multiLang=0`;
            }
            const dataSearch = yield fetch(urlSearch, { headers });
            const textSearch = yield dataSearch.text();
            console.log("textSearch: " + textSearch);
            console.log("textSearch: " + `https://aquariumtv.app/decrypt?data=${textSearch}&key=${KEY}`);
            const decryptX = yield axios_1.default.get(`https://aquariumtv.app/decrypt?data=${textSearch}&key=${KEY}`);
            const decrypt = yield (yield fetch(`https://aquariumtv.app/decrypt?data=${textSearch}&key=${KEY}`)).text();
            console.log("decrypt: " + decrypt);
            const encoded = this._cryptoMethods.encodeID(id);
            const endpoint = isMovie
                ? `movie/${encoded}`
                : `tv/${encoded}/${season}/${episode}`;
            const response = yield (yield fetch(this.baseURL + endpoint)).text();
            const link = this._cryptoMethods.decrypt(response);
            return JSON.parse(link);
        });
    }
}
exports.default = Vidlink;
