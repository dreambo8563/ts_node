"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : new P(function (resolve) { resolve(result.value); }).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
const express = require("express");
const Response = require("../utils/response");
const todo_1 = require("../controllers/todo");
const R = require("ramda");
const router = express.Router();
router.post("/", (req, res) => __awaiter(this, void 0, void 0, function* () {
    let todoItem;
    try {
        todoItem = new todo_1.Todo(req.body.name, req.body.description);
        // save it to db
        yield todo_1.Todo.createToDo(todoItem);
        // Response.respondJSON(res, false, { test: "testmsg" })
        Response.respondJSON(res, true, todoItem);
    }
    catch (error) {
        Response.respondJSON(res, false, error.message);
    }
}));
router.put("/", (req, res) => __awaiter(this, void 0, void 0, function* () {
    let todoItem = req.body;
    // modify todo info
    try {
        yield todo_1.Todo.updateToDo(todoItem);
        Response.respondJSON(res, true, todoItem);
    }
    catch (error) {
        // error on modify
        Response.respondJSON(res, false, error.message);
    }
}));
router.delete("/:id", (req, res) => __awaiter(this, void 0, void 0, function* () {
    const id = req.params.id;
    try {
        yield todo_1.Todo.delToDo(id);
        Response.respondJSON(res, true, { id });
    }
    catch (error) {
        // error on del
        Response.respondJSON(res, false, error.message);
    }
}));
router.get("/:id", (req, res) => __awaiter(this, void 0, void 0, function* () {
    const id = req.params.id;
    try {
        let todoArr = yield todo_1.Todo.getToDo(id);
        Response.respondJSON(res, true, R.head(todoArr) || []);
    }
    catch (error) {
        // error on get info
        Response.respondJSON(res, false, error.message);
    }
}));
router.get("/", (req, res) => __awaiter(this, void 0, void 0, function* () {
    // search by query
    try {
        let todoArr = yield todo_1.Todo.getTodos(req.query);
        Response.respondJSON(res, true, todoArr);
    }
    catch (error) {
        // error on get info
        Response.respondJSON(res, false, error.message);
    }
}));
router.post("/batch", (req, res) => __awaiter(this, void 0, void 0, function* () {
    let todoCol;
    try {
        todoCol = req.body.list.map(v => new todo_1.Todo(v.name, v.description));
        const ids = yield todo_1.Todo.batchAdd(todoCol);
        Response.respondJSON(res, true, { ids });
    }
    catch (error) {
        Response.respondJSON(res, false, error.message);
    }
}));
router.put("/batch", (req, res) => __awaiter(this, void 0, void 0, function* () {
    let todoCol = req.body.list;
    try {
        const list = yield todo_1.Todo.batchUpdate(todoCol);
        Response.respondJSON(res, true, { list });
    }
    catch (error) {
        Response.respondJSON(res, false, error.message);
    }
}));
router.delete("/batch", (req, res) => __awaiter(this, void 0, void 0, function* () {
    let ids = req.body.list;
    try {
        const list = yield todo_1.Todo.batchDel(ids);
        Response.respondJSON(res, true, { list });
    }
    catch (error) {
        Response.respondJSON(res, false, error.message);
    }
}));
exports.default = router;
//# sourceMappingURL=todo.js.map