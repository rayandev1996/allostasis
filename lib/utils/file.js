"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.MyBlobToBuffer = void 0;
const blob_to_buffer_1 = __importDefault(require("blob-to-buffer"));
function MyBlobToBuffer(blob, callback) {
    if (blob == null) {
        callback(null, undefined);
    }
    else {
        (0, blob_to_buffer_1.default)(blob, callback);
    }
}
exports.MyBlobToBuffer = MyBlobToBuffer;
