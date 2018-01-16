"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const Encryption = require("../utils/encryption");
const moment = require("moment");
const config_1 = require("../config");
function txSig(session) {
    const txTime = moment()
        .add(24, "hours")
        .unix()
        .toString(16)
        .toUpperCase();
    const liveCode = `${config_1.Config().live.bizid}_${session}`;
    const txSecret = Encryption.MD5(`${config_1.Config().live.pushKey}${liveCode}${txTime}`);
    return {
        txTime,
        txSecret
    };
}
exports.txSig = txSig;
function genUrls(session) {
    const bizid = config_1.Config().live.bizid;
    const liveCode = `${bizid}_${session}`;
    const sig = txSig(session);
    return {
        pushUrl: `rtmp://${bizid}.livepush.myqcloud.com/live/${liveCode}?txSecret=${sig.txSecret}&txTime=${sig.txTime}`,
        playUrl: `rtmp://${bizid}.liveplay.myqcloud.com/live/${liveCode}`,
        playUrlFLV: `http://${bizid}.liveplay.myqcloud.com/live/${liveCode}.flv`,
        playUrlHLS: `http://${bizid}.liveplay.myqcloud.com/live/${liveCode}.m3u8`
    };
}
exports.genUrls = genUrls;
//# sourceMappingURL=live.js.map