import * as express from "express"
import * as Response from "../utils/response"
import * as R from "ramda"
import { respondJSON } from "../utils/response"
import { CoursesController } from "../controllers/courses"
import * as momentTZ from "moment-timezone"
import * as moment from "moment-timezone"

const router = express.Router()

router.get("/", async (req, res) => {
  // search by query
  try {
    const courses = await CoursesController.getPreservedCourses(
      req.query.page,
      req.query.currentWeek,
      req.query.pageSize
    )
    const counts: any[] = await CoursesController.getPreservedCourses(
      -1,
      req.query.currentWeek,
      req.query.pageSize
    )
    // console.log(momentTZ.tz(moment().valueOf(), "America/Toronto").format())
    Response.respondJSON(res, true, {
      list: courses.map((v: object, i: number) => ({ ...v, id: i })),
      counts: R.head(counts).count
    })
  } catch (error) {
    // error on get info
    Response.respondJSON(res, false, error.message)
  }
})

export default router
