import DB from "../db"
import * as Knex from "knex"
const dataDB = DB.getInstance()
import redisClient, { redis } from "../redis"
import { LeavesController } from "./leavesController"
import { CoursesController } from "./courses"

// FIXME: 应该改为ClassRoomController 这里都是课程不是单纯的老师
export class TeachersController {
  static async getAvailbelTeachers() {
    // 从redis获取被锁定的老师 - 已转为set类型
    const hasCache = await redisClient.exist("teachers", "lockedIds")
    if (!hasCache) {
      const lockedIds = await this.getLockedTeachers()
      let lockedArr = []
      for (let key of lockedIds) {
        const locked = await redis.get(key)
        lockedArr.push({
          key,
          locked
        })
      }
      await redisClient.addSet(
        "teachers",
        "lockedIds",
        lockedArr
          .filter(v => parseInt(v.locked))
          .map(v => v.key.substring("lockEchoTeacherTime".length))
      )
    }

    const ids: string[] = await redisClient.getSetMembers(
      "teachers",
      "lockedIds"
    )

    const allLeavesTeachers = LeavesController.getLeavesTeachersQuery().as(
      "ltp"
    )
    const inProgressCourseQuery = CoursesController.getInProgressCourseWithTs().as(
      "gcs"
    )
    // 短期假的课程id数组
    let courseDelAskForLeaveList = await redis.get("courseDelAskForLeaveList")
    let courseDelArr: string[] = []
    if (courseDelAskForLeaveList && JSON.parse(courseDelAskForLeaveList)) {
      Object.keys(JSON.parse(courseDelAskForLeaveList)).forEach((k, i) => {
        courseDelArr.push(JSON.parse(courseDelAskForLeaveList)[k])
      })
    }
    // 长假课程id数组
    const courseAskForLeaveList = await redis.get("courseAskForLeaveList")

    // 学生请假的sid数组,这些课会变成可用的课程
    const leavesArr = courseDelArr.concat(
      JSON.parse(courseAskForLeaveList) || []
    )

    console.log(leavesArr, "courseAskForLeaveList")
    let allAvailabelTime = dataDB
      .select(
        "gcv.id",
        "gcv.tid",
        "gcv.zone",
        "gcv.status",
        "gcv.cn_start",
        "gcv.cn_end",
        "gcv.cn_week",
        "gcv.next_available_ts"
        // dataDB.raw("count(*) as count")
      )
      .distinct()
      .from("game_course_t_view as gcv")
      .leftJoin(allLeavesTeachers, function() {
        // 排除请假老师中,时间冲突的
        this.on("ltp.tid", "=", "gcv.tid").andOnBetween(
          "gcv.next_available_ts",
          [dataDB.raw("ltp.start"), dataDB.raw("ltp.end")]
        )
      })
      .leftJoin(inProgressCourseQuery, function() {
        // 排除时间一样,已经预约了的课程中的老师
        this.on("gcs.tid", "=", "gcv.tid")
          .andOn("gcv.cn_week", "=", "gcs.cn_week")
          .andOn("gcv.cn_start", "gcs.cn_start")
          .andOnNotIn("gcs.sid", leavesArr)
      })
      .whereNull("gcs.tid")
      .whereNull("ltp.tid")
      .andWhere("gcv.status", 0)
      .where("gcv.cn_week", 1)

    if (ids.length > 0) {
      // 去除被锁定的老师
      allAvailabelTime = allAvailabelTime.whereNotIn("gcv.tid", ids)
    }
    console.log(allAvailabelTime.toSQL().sql)
    return allAvailabelTime
    // .orOnNotBetween(
    //   "gcv.next_available_ts",
    //   ["ltq.start", "ltq.end"]
    // )
  }
  /**
   * 从redis获取被锁定的老师
   *
   * @static
   * @returns
   * @memberof TeachersController
   */
  static getLockedTeachers() {
    return redis.keys("lockEchoTeacherTime*")
  }
}
