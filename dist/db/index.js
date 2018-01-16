"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const Knex = require("knex");
const config_1 = require("./config");
let db;
class DB {
    static getInstance() {
        if (!db) {
            db = Knex(config_1.config);
        }
        return db;
    }
}
exports.default = DB;
//# sourceMappingURL=index.js.map