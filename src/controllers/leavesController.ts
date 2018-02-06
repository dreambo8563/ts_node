import DB from "../db"
import * as Knex from "knex"
const dataDB = DB.getInstance()
// import redisClient, { redis } from "../redis"

export class LeavesController {
  static getLeavesTeachersQuery() {
    return dataDB
      .select("*")
      .from("game_tutor_leave")
      .where("status", 0)
  }

}
