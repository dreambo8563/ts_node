import * as Live from '../utils/live'

const rooms: any = {}

export function createRoom(roomName: string) {
    if (rooms[roomName]) {
        return false
    }
    rooms[roomName] = {users: {}}
    return true
}

export function joinRoom(roomName: string, session: string) {
    if (!get(roomName)) {
        createRoom(roomName)
    }
    rooms[roomName].users[session] = Live.genUrls(session)
}

export function get(roomName: string) {
    return rooms[roomName]
}

export function leaveRoom(roomName: string, session: string) {
    const room = get(roomName)
    if (!room) {
        return false
    }
    delete room.users[session]
    if (Object.keys(room.users).length === 0) {
        delete rooms[roomName]
    }
}

export function list() {
    return rooms
}
