"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const http = require("http");
const _1 = require("../config/");
const debugger_1 = require("../utils/debugger");
function StartServer() {
    const app = require("./app").default;
    const port = normalizePort(process.env.PORT || _1.Config().app.port);
    app.set("port", port);
    const server = http.createServer(app);
    server.listen(port);
    server.on("error", onError);
    server.on("listening", onListening);
    function normalizePort(val) {
        const port = parseInt(val, 10);
        // TODO: when we will get a string as port?
        if (isNaN(port)) {
            return val;
        }
        if (port >= 0) {
            return port;
        }
        // 8080 as default
        return 8080;
    }
    function onError(error) {
        // @ts-ignore
        if (error.syscall !== "listen") {
            throw error;
        }
        var bind = typeof port === "string" ? "Pipe " + port : "Port " + port;
        // @ts-ignore
        switch (error.code) {
            case "EACCES":
                console.error(bind + " requires elevated privileges");
                process.exit(1);
                break;
            case "EADDRINUSE":
                console.error(bind + " is already in use");
                process.exit(1);
                break;
            default:
                throw error;
        }
    }
    function onListening() {
        var addr = server.address();
        // TODO: when we can get string?
        var bind = typeof addr === "string" ? "pipe " + addr : "port " + addr.port;
        debugger_1.debugInfo("Listening on " + bind);
    }
}
exports.StartServer = StartServer;
//# sourceMappingURL=server.js.map