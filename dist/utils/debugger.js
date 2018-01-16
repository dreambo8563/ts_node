"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const debug = require("debug");
// keep the debug function
let _debugger;
function debugInfo(...args) {
    if (!_debugger) {
        // start with 'server:global' for debug info
        _debugger = debug("server:global");
    }
    return _debugger.apply(this, arguments);
}
exports.debugInfo = debugInfo;
//# sourceMappingURL=debugger.js.map