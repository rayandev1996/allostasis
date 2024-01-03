"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.uint8Array = void 0;
function uint8Array(text) {
    const buf = Buffer.from(text, 'utf-8');
    const result = new Uint8Array(buf.buffer, buf.byteOffset, buf.byteLength);
    return result;
}
exports.uint8Array = uint8Array;
