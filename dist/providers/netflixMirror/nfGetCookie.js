"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
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
exports.NetMirrorCookieFetcher = void 0;
exports.nfGetCookie = nfGetCookie;
const axios_1 = __importDefault(require("axios"));
const getBaseUrl_1 = require("../../utils/getBaseUrl");
const cheerio = __importStar(require("cheerio"));
class NetMirrorCookieFetcher {
    /**
     * Fetches a cookie with intelligent caching and error handling
     * @returns Promise resolving to the cookie string
     */
    static fetchCookie() {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                // Fetch new cookie with retry mechanism
                return yield this.fetchFreshCookie();
            }
            catch (err) {
                console.error('NetMirror cookie fetch failed:', err);
                return '';
            }
        });
    }
    /**
     * Fetches a fresh cookie with multiple verification steps
     * @returns Promise resolving to the new cookie
     */
    static fetchFreshCookie() {
        return __awaiter(this, void 0, void 0, function* () {
            const baseUrl = yield (0, getBaseUrl_1.getBaseUrl)('nfMirror');
            // Fetch initial page to get addhash
            const res = yield axios_1.default.get(`${baseUrl}/home`, { withCredentials: false });
            const $ = cheerio.load(res.data);
            const addhash = $('body').attr('data-addhash');
            if (!addhash) {
                throw new Error('Unable to extract addhash');
            }
            // Preliminary verification
            yield this.performPreliminaryVerification(addhash);
            // Cookie verification with retry logic
            const cookie = yield this.verifyCookie(baseUrl, addhash);
            // Cache the new cookie
            this.cacheCookie(cookie);
            return cookie;
        });
    }
    /**
     * Performs preliminary verification request
     * @param addhash Verification hash
     */
    static performPreliminaryVerification(addhash) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                yield fetch(`https://userverify.netmirror.app/verify?dp1=${addhash}&a=y&t=${Math.random()}`, { credentials: 'omit' });
            }
            catch (err) {
                console.warn('Preliminary verification failed:', err);
            }
        });
    }
    /**
     * Verifies and retrieves the cookie with retry mechanism
     * @param baseUrl Base URL for verification
     * @param addhash Verification hash
     * @returns Promise resolving to the cookie string
     */
    static verifyCookie(baseUrl, addhash) {
        return __awaiter(this, void 0, void 0, function* () {
            for (let attempt = 1; attempt <= this.MAX_RETRY_ATTEMPTS; attempt++) {
                const form = new FormData();
                form.append('verify', addhash);
                const verificationPromise = new Promise((resolve, reject) => {
                    const timeoutId = setTimeout(() => {
                        reject(new Error('Cookie verification timed out'));
                    }, this.VERIFY_TIMEOUT_MS);
                    this.performCookieVerification(baseUrl, form)
                        .then(cookie => {
                        clearTimeout(timeoutId);
                        resolve(cookie);
                    })
                        .catch(err => {
                        clearTimeout(timeoutId);
                        reject(err);
                    });
                });
                try {
                    return yield verificationPromise;
                }
                catch (err) {
                    console.warn(`Cookie verification attempt ${attempt} failed:`, err);
                    if (attempt === this.MAX_RETRY_ATTEMPTS) {
                        throw err;
                    }
                    // Optional: add a small delay between retries
                    yield new Promise(resolve => setTimeout(resolve, 1000));
                }
            }
            throw new Error('Failed to retrieve cookie after multiple attempts');
        });
    }
    /**
     * Performs the actual cookie verification request
     * @param baseUrl Base URL for verification
     * @param form FormData for verification
     * @returns Promise resolving to the cookie string
     */
    static performCookieVerification(baseUrl, form) {
        return __awaiter(this, void 0, void 0, function* () {
            const res2 = yield fetch(`${baseUrl}/verify2.php`, {
                method: 'POST',
                body: form,
                credentials: 'omit',
            });
            const res2Json = yield res2.json();
            console.log('NetMirror verification response:', res2Json);
            if (res2Json.statusup !== 'All Done') {
                throw new Error('Verification not complete');
            }
            const cookie2 = res2.headers.get('set-cookie');
            if (!cookie2) {
                throw new Error('No cookie found in response');
            }
            return `${cookie2.split(';')[0]};`;
        });
    }
    /**
     * Caches the retrieved cookie
     * @param cookie Cookie string to cache
     */
    static cacheCookie(cookie) {
    }
}
exports.NetMirrorCookieFetcher = NetMirrorCookieFetcher;
NetMirrorCookieFetcher.COOKIE_CACHE_KEY = 'nfCookie';
NetMirrorCookieFetcher.COOKIE_TIME_KEY = 'nfCookieTime';
NetMirrorCookieFetcher.COOKIE_EXPIRY_MS = 79200000; // 22 hours
NetMirrorCookieFetcher.VERIFY_TIMEOUT_MS = 25000;
NetMirrorCookieFetcher.MAX_RETRY_ATTEMPTS = 50;
// Usage
function nfGetCookie() {
    return __awaiter(this, void 0, void 0, function* () {
        return NetMirrorCookieFetcher.fetchCookie();
    });
}
