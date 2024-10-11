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
exports.getVidSrcRip = getVidSrcRip;
function getVidSrcRip(tmdbId, season, episode, stream) {
    return __awaiter(this, void 0, void 0, function* () {
        //const sources = ['flixhq', 'vidsrcuk', 'vidsrcicu'];
        const sources = ['flixhq', 'vidsrcicu'];
        const baseUrl = 'aHR0cHM6Ly92aWRzcmMucmlw';
        yield Promise.all(sources.map((source) => __awaiter(this, void 0, void 0, function* () {
            var _a;
            const apiUrl = yield useVRF(source, tmdbId, season, episode);
            let urlRequest = atob(baseUrl) + apiUrl;
            console.log("urlRequest: " + urlRequest);
            const response = yield fetch(atob(baseUrl) + apiUrl);
            const data = yield response.json();
            console.log("data: " + JSON.stringify(data));
            if (data != null) {
                if (((_a = data.sources) === null || _a === void 0 ? void 0 : _a.length) > 0) {
                    stream.push({
                        server: source,
                        type: (data === null || data === void 0 ? void 0 : data.sources[0].file.includes('.mp4')) ? 'mp4' : 'm3u8',
                        link: data === null || data === void 0 ? void 0 : data.sources[0].file,
                        subtitles: []
                    });
                }
            }
        })));
    });
}
function generateVRF(sourceIdentifier, tmdbId) {
    return __awaiter(this, void 0, void 0, function* () {
        // Helper function to fetch key from image
        function fetchKeyFromImage() {
            return __awaiter(this, void 0, void 0, function* () {
                const response = yield fetch('https://vidsrc.rip/images/skip-button.png');
                const data = yield response.text();
                console.log('Fetched data from image:', data);
                return data;
            });
        }
        // XOR encryption/decryption function
        function xorEncryptDecrypt(key, data) {
            const keyChars = Array.from(key, char => char.charCodeAt(0));
            const dataChars = Array.from(data, char => char.charCodeAt(0));
            const result = [];
            for (let i = 0; i < dataChars.length; i++) {
                result.push(dataChars[i] ^ keyChars[i % keyChars.length]);
            }
            return String.fromCharCode(...result);
        }
        // Fetch the key
        const key = yield fetchKeyFromImage();
        console.log('Fetched key:', key);
        // Construct the input string
        const input = `/api/source/${sourceIdentifier}/${tmdbId}`;
        // Decode the input string
        const decodedInput = decodeURIComponent(input);
        // Perform XOR encryption
        const xorResult = xorEncryptDecrypt(key, decodedInput);
        // Base64 encode and URL encode the result
        const vrf = encodeURIComponent(btoa(xorResult));
        return vrf;
    });
}
// Usage example
function useVRF(sourceIdentifier, tmdbId, season, episode) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const vrf = yield generateVRF(sourceIdentifier, tmdbId);
            console.log('Generated VRF:', vrf);
            const params = season && episode ? `&s=${season}&e=${episode}` : '';
            // Use the VRF in your API call
            const apiUrl = `/api/source/${sourceIdentifier}/${tmdbId}?vrf=${vrf}${params}`;
            console.log('API URL:', apiUrl);
            // Make your API call here
            // const response = await fetch(apiUrl);
            // ... handle the response
            return apiUrl;
        }
        catch (error) {
            console.error('Error generating VRF:', error);
        }
    });
}
