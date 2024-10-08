"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.makeSourcerer = makeSourcerer;
exports.makeEmbed = makeEmbed;
function makeSourcerer(state) {
    var _a, _b;
    const mediaTypes = [];
    if (state.scrapeMovie)
        mediaTypes.push('movie');
    if (state.scrapeShow)
        mediaTypes.push('show');
    return Object.assign(Object.assign({}, state), { type: 'source', disabled: (_a = state.disabled) !== null && _a !== void 0 ? _a : false, externalSource: (_b = state.externalSource) !== null && _b !== void 0 ? _b : false, mediaTypes });
}
function makeEmbed(state) {
    var _a;
    return Object.assign(Object.assign({}, state), { type: 'embed', disabled: (_a = state.disabled) !== null && _a !== void 0 ? _a : false, mediaTypes: undefined });
}
