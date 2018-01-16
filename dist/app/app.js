"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express = require("express");
const path = require("path");
const favicon = require("serve-favicon");
const logger = require("morgan");
const cookieParser = require("cookie-parser");
const bodyParser = require("body-parser");
const _1 = require("../config/");
const routes_1 = require("../routes");
const app = express();
// view engine setup
app.set("views", path.join(_1.rootDir(), "views"));
app.set("view engine", "jade");
// uncomment after placing your favicon in /public
app.use(favicon(path.join(_1.rootDir(), "public", "favicon.png")));
app.use(logger("dev"));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(_1.rootDir(), "public")));
// router bind
app.use("/api", routes_1.default.api);
app.use("/debug", routes_1.default.debug);
app.use("/tencent", routes_1.default.tencent);
app.use("/todo", routes_1.default.todo);
// catch 404 and forward to error handler
app.use(function (req, res, next) {
    const err = new Error("Not Found");
    // @ts-ignore
    err.status = 404;
    next(err);
});
// error handler
app.use((err, req, res, next) => {
    // set locals, only providing error in development
    res.locals.message = err.message;
    res.locals.error = req.app.get("env") === "development" ? err : {};
    // render the error page
    // @ts-ignore
    res.status(err.status || 500);
    res.render("error");
});
exports.default = app;
//# sourceMappingURL=app.js.map