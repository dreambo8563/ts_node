"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express = require("express");
const Response = require("../utils/response");
const WechatUsers = require("../controllers/wechatUsers");
const Room = require("../controllers/room");
const router = express.Router();
router.get("/room/:roomName", (req, res) => {
    const roomName = req.params.roomName;
    const room = Room.get(roomName) || {};
    Response.respondJSON(res, true, room);
});
router.get("/users", (req, res) => {
    Response.respondJSON(res, true, WechatUsers.list());
});
exports.default = router;
//# sourceMappingURL=debug.js.map