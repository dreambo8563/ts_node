import * as express from "express"
import * as Response from "../utils/response"
import * as WechatUsers from "../controllers/wechatUsers"
import * as Room from "../controllers/room"
const router = express.Router()

router.get("/room/:roomName", (req, res) => {
  const roomName = req.params.roomName
  const room = Room.get(roomName) || {}
  Response.respondJSON(res, true, room)
})

router.get("/users", (req, res) => {
  Response.respondJSON(res, true, WechatUsers.list())
})

export default router
