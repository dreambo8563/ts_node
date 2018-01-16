"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const path = require("path");
const debugger_1 = require("../utils/debugger");
// keep current config
let _config;
// get mode from env
function env() {
    return process.env.NODE_ENV || "development";
}
exports.env = env;
// get project root path
function rootDir() {
    return path.resolve("./");
}
exports.rootDir = rootDir;
// load config based on the env
function Config() {
    if (!_config) {
        _config = require(`./${env()}`);
    }
    return _config.config;
}
exports.Config = Config;
function Initialize() {
    Config();
    debugger_1.debugInfo("Current ENV is:", env());
    debugger_1.debugInfo("Server Root Dir is:", rootDir());
}
exports.Initialize = Initialize;
//# sourceMappingURL=index.js.map