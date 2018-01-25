import * as express from "express"
import * as Response from "../utils/response"
import { Todo } from "../controllers/todo"
import * as R from "ramda"
import { respondJSON } from "../utils/response"
import redis from "../redis"
import { uploader } from "../utils/upload"

const router = express.Router()

router.post("/", async (req, res) => {
  let todoItem: Todo
  console.log(req.session)
  try {
    todoItem = new Todo(req.body.name, req.body.description)
    // save it to db
    const ids = await Todo.createToDo(todoItem)
    // Response.respondJSON(res, false, { test: "testmsg" })
    // await redis.set("todo", R.head(ids).toString(), todoItem.name, 60)
    // await redis.multiSet(`todo:${R.head(ids)}`, Object({ name: todoItem.name }))
    await redis.multHashSet("todo", String(R.head(ids)), Object(todoItem))
    Response.respondJSON(res, true, todoItem)
  } catch (error) {
    Response.respondJSON(res, false, error.message)
  }
})

router.post("/upload", (req, res, next) => {
  uploader.single("file")(req, res, function(err) {
    if (err) {
      Response.respondJSON(res, false, err.message)
    }
    Response.respondJSON(res, true, {})
  })
})
router.put("/", async (req, res) => {
  let todoItem = <Todo>req.body
  // modify todo info

  try {
    await Todo.updateToDo(todoItem)
    Response.respondJSON(res, true, todoItem)
  } catch (error) {
    // error on modify
    Response.respondJSON(res, false, error.message)
  }
})
router.delete("/batch", async (req, res) => {
  let ids: number[] = req.body.list
  try {
    const list = await Todo.batchDel(ids)
    console.log("batch del", list)
    Response.respondJSON(res, true, { list })
  } catch (error) {
    Response.respondJSON(res, false, error.message)
  }
})

router.delete("/:id", async (req, res) => {
  const id = req.params.id
  try {
    await Todo.delToDo(id)
    redis.delete("todo", `${id}:name`)
    Response.respondJSON(res, true, { id })
  } catch (error) {
    // error on del
    Response.respondJSON(res, false, error.message)
  }
})

router.get("/:id", async (req, res) => {
  const id = req.params.id
  try {
    const names = await redis.multiGet("todo", ["1:name", "2:name", "3:name"])
    console.log("names", names)
    let todoArr: Todo[] = await Todo.getToDo(id)
    Response.respondJSON(res, true, R.head(todoArr) || [])
  } catch (error) {
    // error on get info
    Response.respondJSON(res, false, error.message)
  }
})
router.get("/", async (req, res) => {
  // search by query
  try {
    let todoArr: Todo[] = await Todo.getTodos(req.query)
    Response.respondJSON(res, true, todoArr)
  } catch (error) {
    // error on get info
    Response.respondJSON(res, false, error.message)
  }
})

router.post("/batch", async (req, res) => {
  let todoCol: Todo[]
  try {
    todoCol = (<Todo[]>req.body.list).map(v => new Todo(v.name, v.description))
    const ids = await Todo.batchAdd(todoCol)
    Response.respondJSON(res, true, { ids })
  } catch (error) {
    Response.respondJSON(res, false, error.message)
  }
})

router.put("/batch", async (req, res) => {
  let todoCol: Todo[] = req.body.list
  try {
    const list = await Todo.batchUpdate(todoCol)
    Response.respondJSON(res, true, { list })
  } catch (error) {
    Response.respondJSON(res, false, error.message)
  }
})

export default router
