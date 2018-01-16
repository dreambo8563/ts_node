import * as Knex from "knex"
import { config } from "./config"

let db: Knex
export default class DB {
  static getInstance() {
    if (!db) {
      db = Knex(config)
    }
    return db
  }
}
