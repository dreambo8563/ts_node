"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const Live = require("../utils/live");
const rooms = {};
function createRoom(roomName) {
    if (rooms[roomName]) {
        return false;
    }
    rooms[roomName] = { users: {} };
    return true;
}
exports.createRoom = createRoom;
function joinRoom(roomName, session) {
    if (!get(roomName)) {
        createRoom(roomName);
    }
    rooms[roomName].users[session] = Live.genUrls(session);
}
exports.joinRoom = joinRoom;
function get(roomName) {
    return rooms[roomName];
}
exports.get = get;
function leaveRoom(roomName, session) {
    const room = get(roomName);
    if (!room) {
        return false;
    }
    delete room.users[session];
    if (Object.keys(room.users).length === 0) {
        delete rooms[roomName];
    }
}
exports.leaveRoom = leaveRoom;
function list() {
    return rooms;
}
exports.list = list;
//# sourceMappingURL=room.js.map