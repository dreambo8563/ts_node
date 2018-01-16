"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var EventType;
(function (EventType) {
    EventType[EventType["StreamingBreak"] = 0] = "StreamingBreak";
    EventType[EventType["StreamingPush"] = 1] = "StreamingPush";
    EventType[EventType["RecordingNew"] = 100] = "RecordingNew";
    EventType[EventType["ScreenshotNew"] = 200] = "ScreenshotNew";
})(EventType = exports.EventType || (exports.EventType = {}));
const _messages = [];
class TencentMessage {
    static ParseEventType(et) {
        if (et === 0)
            return EventType.StreamingBreak;
        else if (et === 1)
            return EventType.StreamingPush;
        else if (et === 100)
            return EventType.RecordingNew;
        else if (et === 200)
            return EventType.ScreenshotNew;
        // what about return EventType[EventType[et]]
    }
    static ExtractFromReq(reply) {
        const msg = new TencentMessage();
        msg.t = reply.t;
        msg.sign = reply.sign;
        msg.eventType = TencentMessage.ParseEventType(reply.event_type);
        msg.streamId = reply.stream_id;
        msg.channelId = reply.channel_id;
        if (reply.video_url) {
            msg.videoUrl = reply.video_url;
        }
        return msg;
    }
    static Append(m) {
        _messages.push(m);
    }
    static List() {
        return _messages;
    }
}
exports.TencentMessage = TencentMessage;
//# sourceMappingURL=tencentMessage.js.map