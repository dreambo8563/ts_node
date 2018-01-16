import DB from "../db"
import * as Knex from "knex"
const db = DB.getInstance()

enum TodoStatus {
  NotStart = 1,
  InProgress,
  Completed
}

export class Todo {
  id?: number
  name: string
  description: string
  status?: TodoStatus

  constructor(name: string, description: string, status = TodoStatus.NotStart) {
    this.validate(name, description)
    this.name = name
    this.description = description
    this.status = status
  }

  validate(name: string, desc: string) {
    if (!name) {
      throw Error("please input name")
    }
    if (!desc) {
      throw Error("please input desc")
    }
  }

  static createToDo(todo: Todo) {
    return db("todo").insert(todo)
  }
  static batchAdd(todos: Todo[]) {
    // only last id got https://github.com/tgriesser/knex/issues/1828
    return db.batchInsert("todo", todos, todos.length).returning("id")
  }

  static updateToDo(todo: Todo) {
    return db("todo")
      .where({ id: todo.id })
      .update(todo)
  }
  static batchUpdate(todos: Todo[]) {
    // todo => promise
    return db.transaction(function(trx) {
      return Promise.all(
        todos.map(todo =>
          db("todo")
            .transacting(trx)
            .where({ id: todo.id })
            .update(todo)
        )
      )
        .then(trx.commit)
        .catch(trx.rollback)
    })
  }

  static delToDo(id: number) {
    return db("todo")
      .where({ id })
      .del()
  }
  static batchDel(ids: number[]) {
    // todo => promise
    return db.transaction(function(trx) {
      return Promise.all(
        ids.map(id =>
          db("todo")
            .transacting(trx)
            .where({ id })
            .del()
        )
      )
        .then(trx.commit)
        .catch(trx.rollback)
    })
  }
  static getToDo(id: number) {
    return db("todo").where({ id })
  }
  static getTodos(filter: { name?: string; desc?: string; status?: number }) {
    let list = db("todo")
    if (filter.name) {
      list = list.where("name", "like", `%${filter.name}%`)
    }
    if (filter.desc) {
      list = list.where("description", "like", `%${filter.desc}%`)
    }
    if (filter.status) {
      list = list.where("status", filter.status)
    }
    return list
  }
}
