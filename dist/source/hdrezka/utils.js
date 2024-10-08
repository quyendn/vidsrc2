"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.extractTitleAndYear = extractTitleAndYear;
exports.parseSubtitleLinks = parseSubtitleLinks;
exports.parseVideoLinks = parseVideoLinks;
exports.generateRandomFavs = generateRandomFavs;
const captions_1 = require("../../utils/captions");
const errors_1 = require("../../utils/errors");
const quality_1 = require("../../utils/quality");
function generateRandomFavs() {
    const randomHex = () => Math.floor(Math.random() * 16).toString(16);
    const generateSegment = (length) => Array.from({ length }, randomHex).join('');
    return `${generateSegment(8)}-${generateSegment(4)}-${generateSegment(4)}-${generateSegment(4)}-${generateSegment(12)}`;
}
function parseSubtitleLinks(inputString) {
    if (!inputString || typeof inputString === 'boolean')
        return [];
    const linksArray = inputString.split(',');
    const captions = [];
    linksArray.forEach((link) => {
        const match = link.match(/\[([^\]]+)\](https?:\/\/\S+?)(?=,\[|$)/);
        if (match) {
            const type = (0, captions_1.getCaptionTypeFromUrl)(match[2]);
            const language = (0, captions_1.labelToLanguageCode)(match[1]);
            if (!type || !language)
                return;
            captions.push({
                id: match[2],
                language,
                hasCorsRestrictions: false,
                type,
                url: match[2],
            });
        }
    });
    return captions;
}
function parseVideoLinks(inputString) {
    if (!inputString)
        throw new errors_1.NotFoundError('No video links found');
    const linksArray = inputString.split(',');
    const result = {};
    linksArray.forEach((link) => {
        const match = link.match(/\[([^]+)](https?:\/\/[^\s,]+\.mp4)/);
        if (match) {
            const qualityText = match[1];
            const mp4Url = match[2];
            const numericQualityMatch = qualityText.match(/(\d+p)/);
            const quality = numericQualityMatch ? numericQualityMatch[1] : 'Unknown';
            const validQuality = (0, quality_1.getValidQualityFromString)(quality);
            result[validQuality] = { type: 'mp4', url: mp4Url };
        }
    });
    return result;
}
function extractTitleAndYear(input) {
    const regex = /^(.*?),.*?(\d{4})/;
    const match = input.match(regex);
    if (match) {
        const title = match[1];
        const year = match[2];
        return { title: title.trim(), year: year ? parseInt(year, 10) : null };
    }
    return null;
}
