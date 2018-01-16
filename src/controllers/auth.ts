import * as Encryption from "../utils/encryption"
import { Config } from "../config"
import * as R from "ramda"

export function authenticate(timestamp: number, nonce: string, token: string) {
  let result = { success: true, code: 200 }
  const now = Encryption.timestamp()
  if (now - timestamp > Config().auth.expires) {
    result.success = false
    result.code = 410
  } else {
    const checksum = Encryption.HmacSha1(
      timestamp + nonce,
      Config().auth.secret
    )
    result.success = checksum === token
    result.code = result.success ? 200 : 401
  }
  return result
}

export function login(username: string, password: string) {
  // try to match the login info
  const user = R.find(R.propEq("username", username))(Config().auth.users)
  if (user && user.password === password) {
    // when get it
    const timestamp = Encryption.timestamp()
    const nonce = Encryption.nonce()
    return {
      token: Encryption.HmacSha1(timestamp + nonce, Config().auth.secret),
      timestamp,
      nonce,
      userid: user.userid
    }
  }
  return null
}
