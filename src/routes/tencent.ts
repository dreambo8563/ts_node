import * as express from "express"
import * as Response from "../utils/response"
import Logger from "../utils/logger"
import { EventType, TencentMessage } from "../controllers/tencentMessage"

const router = express.Router()

router.post("/callback", (req, res) => {
  const reply = req.body
  Logger.info(reply)
  Logger.info("test")
  const msg = TencentMessage.ExtractFromReq(reply)
  if (msg.eventType == EventType.RecordingNew) {
    TencentMessage.Append(msg)
  }
  res.sendStatus(200)
})

router.get("/list", (req, res) => {
  Response.respondJSON(res, true, TencentMessage.List())
})

export default router
