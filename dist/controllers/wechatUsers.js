"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const Encryption = require("../utils/encryption");
const config_1 = require("../config");
const moment = require("moment");
// mock data
const users = {
    vincent: {
        session: "vincent-sesssion",
        name: "vincent",
        id: "888",
        lastHeartBeat: moment().unix()
    }
};
function login(session, user) {
    user[session] = Object.assign({}, user, { session, lastHeartBeat: Encryption.timestamp() });
}
exports.login = login;
function list() {
    return users;
}
exports.list = list;
function refresh(session) {
    if (users[session]) {
        users[session].lastHeartBeat = Encryption.timestamp();
    }
}
exports.refresh = refresh;
function logout(session) {
    delete users[session];
}
exports.logout = logout;
function get(session) {
    if (expires(session)) {
        logout(session);
        return null;
    }
    return users[session];
}
exports.get = get;
function expires(session) {
    const user = users[session];
    return (user &&
        Encryption.timestamp() - user.lastHeartBeat > config_1.Config().wechat.expires);
}
exports.expires = expires;
//# sourceMappingURL=wechatUsers.js.map