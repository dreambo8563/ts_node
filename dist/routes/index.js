"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const api_1 = require("../routes/api");
const debug_1 = require("../routes/debug");
const tencent_1 = require("../routes/tencent");
const todo_1 = require("../routes/todo");
exports.default = {
    api: api_1.default,
    debug: debug_1.default,
    tencent: tencent_1.default,
    todo: todo_1.default
};
//# sourceMappingURL=index.js.map