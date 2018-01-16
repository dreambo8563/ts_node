"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express = require("express");
const Response = require("../utils/response");
const logger_1 = require("../utils/logger");
const tencentMessage_1 = require("../controllers/tencentMessage");
const router = express.Router();
router.post("/callback", (req, res) => {
    const reply = req.body;
    logger_1.default.info(reply);
    logger_1.default.info("test");
    const msg = tencentMessage_1.TencentMessage.ExtractFromReq(reply);
    if (msg.eventType == tencentMessage_1.EventType.RecordingNew) {
        tencentMessage_1.TencentMessage.Append(msg);
    }
    res.sendStatus(200);
});
router.get("/list", (req, res) => {
    Response.respondJSON(res, true, tencentMessage_1.TencentMessage.List());
});
exports.default = router;
//# sourceMappingURL=tencent.js.map