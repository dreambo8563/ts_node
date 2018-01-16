"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const db_1 = require("../db");
const db = db_1.default.getInstance();
var TodoStatus;
(function (TodoStatus) {
    TodoStatus[TodoStatus["NotStart"] = 1] = "NotStart";
    TodoStatus[TodoStatus["InProgress"] = 2] = "InProgress";
    TodoStatus[TodoStatus["Completed"] = 3] = "Completed";
})(TodoStatus || (TodoStatus = {}));
class Todo {
    constructor(name, description, status = TodoStatus.NotStart) {
        this.validate(name, description);
        this.name = name;
        this.description = description;
        this.status = status;
    }
    validate(name, desc) {
        if (!name) {
            throw Error("please input name");
        }
        if (!desc) {
            throw Error("please input desc");
        }
    }
    static createToDo(todo) {
        return db("todo").insert(todo);
    }
    static batchAdd(todos) {
        // only last id got https://github.com/tgriesser/knex/issues/1828
        return db.batchInsert("todo", todos, todos.length).returning("id");
    }
    static updateToDo(todo) {
        return db("todo")
            .where({ id: todo.id })
            .update(todo);
    }
    static batchUpdate(todos) {
        // todo => promise
        return db.transaction(function (trx) {
            return Promise.all(todos.map(todo => db("todo")
                .transacting(trx)
                .where({ id: todo.id })
                .update(todo)))
                .then(trx.commit)
                .catch(trx.rollback);
        });
    }
    static delToDo(id) {
        return db("todo")
            .where({ id })
            .del();
    }
    static batchDel(ids) {
        // todo => promise
        return db.transaction(function (trx) {
            return Promise.all(ids.map(id => db("todo")
                .transacting(trx)
                .where({ id })
                .del()))
                .then(trx.commit)
                .catch(trx.rollback);
        });
    }
    static getToDo(id) {
        return db("todo").where({ id });
    }
    static getTodos(filter) {
        let list = db("todo");
        if (filter.name) {
            list = list.where("name", "like", `%${filter.name}%`);
        }
        if (filter.desc) {
            list = list.where("description", "like", `%${filter.desc}%`);
        }
        if (filter.status) {
            list = list.where("status", filter.status);
        }
        return list;
    }
}
exports.Todo = Todo;
//# sourceMappingURL=todo.js.map