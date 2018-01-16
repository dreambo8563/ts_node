import * as Encryption from "../utils/encryption"
import { Config } from "../config"
import * as moment from "moment"

// mock data
const users: any = {
  vincent: {
    session: "vincent-sesssion",
    name: "vincent",
    id: "888",
    lastHeartBeat: moment().unix()
  }
}

export function login(session: string, user: any) {
  user[session] = { ...user, session, lastHeartBeat: Encryption.timestamp() }
}

export function list() {
  return users
}

export function refresh(session: string) {
  if (users[session]) {
    users[session].lastHeartBeat = Encryption.timestamp()
  }
}

export function logout(session: string) {
  delete users[session]
}

export function get(session: string) {
  if (expires(session)) {
    logout(session)
    return null
  }
  return users[session]
}

export function expires(session: string) {
  const user = users[session]
  return (
    user &&
    Encryption.timestamp() - user.lastHeartBeat > Config().wechat.expires
  )
}
