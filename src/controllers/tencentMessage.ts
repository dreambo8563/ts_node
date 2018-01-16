export enum EventType {
    StreamingBreak = 0,
    StreamingPush = 1,
    RecordingNew = 100,
    ScreenshotNew = 200,
}

const _messages: TencentMessage[] = []

export class TencentMessage {
    t: string;
    sign: string;
    eventType: EventType;
    streamId: string;
    channelId: string;
    videoUrl: string;

    static ParseEventType(et: any): EventType {
        if (et === 0) return EventType.StreamingBreak
        else if  (et === 1) return EventType.StreamingPush
        else if  (et === 100) return EventType.RecordingNew
        else if  (et === 200) return EventType.ScreenshotNew
        // what about return EventType[EventType[et]]
    }

    static ExtractFromReq(reply: any): TencentMessage {
        const msg = new TencentMessage()
        msg.t = reply.t
        msg.sign = reply.sign
        msg.eventType = TencentMessage.ParseEventType(reply.event_type)
        msg.streamId = reply.stream_id
        msg.channelId = reply.channel_id
        if (reply.video_url) {
            msg.videoUrl = reply.video_url
        }
        return msg
    }

    static Append(m: TencentMessage) {
        _messages.push(m)
    }

    static List(): TencentMessage[]{
        return _messages
    }
}