"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const CryptoJS = require("crypto-js");
function HmacSha1(plainText, key) {
    return CryptoJS.HmacSHA1(plainText, key).toString();
}
exports.HmacSha1 = HmacSha1;
function nonce() {
    // get random number
    return Math.random()
        .toString(10)
        .substr(2);
}
exports.nonce = nonce;
function timestamp() {
    // based on second not ms
    // TODO: can be instead with moment which we already import
    return Math.floor(Date.now() / 1000);
}
exports.timestamp = timestamp;
function MD5(str) {
    return CryptoJS.MD5(str);
}
exports.MD5 = MD5;
//# sourceMappingURL=encryption.js.map