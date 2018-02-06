import * as express from "express"
import * as Response from "../utils/response"
import * as R from "ramda"
import { respondJSON } from "../utils/response"
import { TeachersController } from "../controllers/teachersController"
import * as momentTZ from "moment-timezone"
import * as moment from "moment-timezone"

const router = express.Router()

router.get("/", async (req, res) => {
  // search by query
  try {
    const teachers: any[] = await TeachersController.getAvailbelTeachers()
    console.log(teachers)
    const nwT = teachers.map(t => {
      return `${t.tid}${t.cn_start}-${t.cn_end}`
    })
    Response.respondJSON(res, true, { nwT })
  } catch (error) {
    // error on get info
    Response.respondJSON(res, false, error.message)
  }
})

export default router
