"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const Encryption = require("../utils/encryption");
const config_1 = require("../config");
const R = require("ramda");
function authenticate(timestamp, nonce, token) {
    let result = { success: true, code: 200 };
    const now = Encryption.timestamp();
    if (now - timestamp > config_1.Config().auth.expires) {
        result.success = false;
        result.code = 410;
    }
    else {
        const checksum = Encryption.HmacSha1(timestamp + nonce, config_1.Config().auth.secret);
        result.success = checksum === token;
        result.code = result.success ? 200 : 401;
    }
    return result;
}
exports.authenticate = authenticate;
function login(username, password) {
    // try to match the login info
    const user = R.find(R.propEq("username", username))(config_1.Config().auth.users);
    if (user && user.password === password) {
        // when get it
        const timestamp = Encryption.timestamp();
        const nonce = Encryption.nonce();
        return {
            token: Encryption.HmacSha1(timestamp + nonce, config_1.Config().auth.secret),
            timestamp,
            nonce,
            userid: user.userid
        };
    }
    return null;
}
exports.login = login;
//# sourceMappingURL=auth.js.map