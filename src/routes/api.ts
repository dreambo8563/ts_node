import * as express from "express"
import Axios from "axios"
import * as Auth from "../controllers/auth"
import * as Encryption from "../utils/encryption"
import * as Response from "../utils/response"
import * as WechatUsers from "../controllers/wechatUsers"
import * as Room from "../controllers/room"
import { Config } from "../config"
const router = express.Router()

router.post("/login", (req, res) => {
  // req.get - get info from header
  const username = req.get("username")
  const password = req.get("password")
  // check the auth info or null
  const info = Auth.login(username, password)
  const success = !!info
  const body = success ? info : { message: "Illegal credential" }
  Response.respondJSON(res, success, body)
})

router.post("/refresh", (req, res) => {
  const session = req.get("session")
  // refresh the timestamp of the session
  WechatUsers.refresh(session)
  return Response.respondJSON(res, true, {})
})

router.post("/code2session", (req, res) => {
  const code = req.get("code")
  const apiUrl = `https://api.weixin.qq.com/sns/jscode2session?appid=${
    Config().wechat.appid
  }&secret=${
    Config().wechat.appsecret
  }&js_code=${code}&grant_type=authorization_code`

  // FIXME: return? necessary?
  return Axios.get(apiUrl)
    .then(resp => {
      let data = resp.data
      if (data.openid) {
        // { openid, session_key, unionid }
        // if weixin response successfully
        const session = Encryption.HmacSha1(data.openid, Config().auth.secret)
        // get the user and save the session
        WechatUsers.login(session, data)
        data = { session }
      }
      // data maybe contain the error code
      Response.respondJSON(res, true, data)
    })
    .catch(err => {
      Response.respondJSON(res, false, { message: err.toString() })
    })
})

// filter non-auth traffic
router.use((req, res, next) => {
  const session = req.get("session")
  const user = WechatUsers.get(session)
  if (!user) {
    return Response.respondJSON(
      res,
      false,
      {
        message: "Unauthorized"
      },
      401
    )
  }
  // @ts-ignore
  req.user = user
  return next()
})
// ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
// all routes below the line is for authorized user

router.get("/greeting", (req, res) => {
  Response.respondJSON(res, true, {
    // @ts-ignore
    greeting: `hello, ${req.user.session}`,
    // @ts-ignore
    name: req.user.name
  })
})

router.get("/roomlist", (req, res) => {
  Response.respondJSON(res, true, Room.list())
})

router.get("/room/:roomname", (req, res) => {
  const roomName = req.params.roomname
  Response.respondJSON(res, true, Room.get(roomName))
})

router.post("/room/join/:roomname", (req, res) => {
  const roomName = req.params.roomname
  // @ts-ignore
  Room.joinRoom(roomName, req.user.session)
  Response.respondJSON(res, true, Room.get(roomName))
})

export default router
