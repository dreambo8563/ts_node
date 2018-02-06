import DB from "../db"
import * as Knex from "knex"
const dataDB = DB.getInstance()
import { redis } from "../redis"

export class CoursesController {
  static getPreservedCourses(
    page: number = 1,
    currentWeek: number = 0,
    pageSize = 20
  ) {
    const innerQuery = dataDB
      .select("uid", "adminUser", dataDB.raw("count('courseid') as classCount"))
      .from("game_course_s")
      .groupByRaw("uid,adminUser")
      .as("m")

    let basicSql =
      page < 0
        ? dataDB.select(dataDB.raw("count(*) as count"))
        : dataDB.select(
            "s.uid",
            "s.tid",
            "c.start",
            "c.end",
            "r.name AS stuName",
            "d1u.s_mark AS stuMark",
            "t.s_mark  AS teacheMark",
            "t.name AS teacheName",
            dataDB.raw("t.used_course < 10 AS isNew"),
            dataDB.raw("t.cPay < 2000 AS isDemo"),
            "s.adminUser",
            "classCount",
            "s.create_time as bookTime",
            // dataDB.raw("c.cid%100 as timeLine"),
            dataDB.raw("floor(c.cid/100) as week")
          )

    basicSql = basicSql
      .from("game_course_s as s")
      .where("status", 0)
      .orWhere("status", -1)
      .leftJoin("game_user_regist as r", "s.uid", "r.id")
      .where({
        "r.db": 1
      })
      .leftJoin("game_course as c", "c.id", "s.courseid")

    if (Number(currentWeek) !== 0) {
      basicSql = basicSql.where(dataDB.raw(`floor(c.cid/100)=${currentWeek}`))
    }

    basicSql = basicSql
      .leftJoin("data_1.game_user as d1u", "d1u.id", "s.uid")
      .leftJoin("data_1.game_user as t", "t.id", "s.tid")
      .leftJoin(innerQuery, function() {
        this.on("m.uid", "=", "s.uid").andOn("m.adminUser", "=", "s.adminUser")
      })
    if (page > 0) {
      basicSql = basicSql.offset((page - 1) * pageSize).limit(pageSize)
    }
    return basicSql

    // basicSql.select(dataDB.raw("count(*) as count"))
  }

  static getInProgressCourseWithTs() {
    return dataDB
      .select("*")
      .from("game_course_s as gcs")
      .leftJoin("game_course_view as gcv", "gcv.id", "gcs.courseid")
      .whereIn("gcs.status", [-1, 0])
  }
}
// SELECT
//   s.uid,
//   s.tid,
//   r.name             AS uname,
//   r.db,
//   c.start,
//   c.end,
//   floor(c.cid / 100) AS week,
//   d1u.s_mark         AS stuMark,
//   t.name             AS teacheName,
//   t.s_mark           AS teacheMark,
//   t.used_course < 10 AS isNew,
//   t.cPay < 2000      AS isDemo,
//   s.adminUser,
//   classCount,
//   s.create_time as bookTime
// FROM game_course_s s LEFT JOIN game_user_regist r ON s.uid = r.id
//   LEFT JOIN game_course c ON c.id = s.courseid
//   LEFT JOIN data_1.game_user d1u ON d1u.id = s.uid
//   LEFT JOIN data_1.game_user t ON s.tid = t.id
//   LEFT JOIN (SELECT uid,adminUser,count(courseid) as classCount from game_course_s GROUP BY uid,adminUser) as m ON m.uid = s.uid and m.adminUser=s.adminUser
// WHERE r.db = 1 AND s.status = 0
