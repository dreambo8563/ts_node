"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
function respondJSON(res, result, data, statusCode) {
    statusCode = statusCode || 200;
    res.status(statusCode).json({
        success: result,
        timestamp: new Date().valueOf(),
        data,
    });
}
exports.respondJSON = respondJSON;
//# sourceMappingURL=response.js.map