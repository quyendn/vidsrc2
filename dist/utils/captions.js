"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.captionTypes = void 0;
exports.getCaptionTypeFromUrl = getCaptionTypeFromUrl;
exports.labelToLanguageCode = labelToLanguageCode;
exports.isValidLanguageCode = isValidLanguageCode;
exports.removeDuplicatedLanguages = removeDuplicatedLanguages;
const iso_639_1_1 = __importDefault(require("iso-639-1"));
exports.captionTypes = {
    srt: 'srt',
    vtt: 'vtt',
};
function getCaptionTypeFromUrl(url) {
    const extensions = Object.keys(exports.captionTypes);
    const type = extensions.find((v) => url.endsWith(`.${v}`));
    if (!type)
        return null;
    return type;
}
function labelToLanguageCode(label) {
    const code = iso_639_1_1.default.getCode(label);
    if (code.length === 0)
        return null;
    return code;
}
function isValidLanguageCode(code) {
    if (!code)
        return false;
    return iso_639_1_1.default.validate(code);
}
function removeDuplicatedLanguages(list) {
    const beenSeen = {};
    return list.filter((sub) => {
        if (beenSeen[sub.language])
            return false;
        beenSeen[sub.language] = true;
        return true;
    });
}
