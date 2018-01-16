"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const winston = require("winston");
const path = require("path");
const fs = require("fs");
const moment = require("moment");
const RotateFile = require('winston-daily-rotate-file');
const config_1 = require("../config");
if (config_1.env() !== 'production') {
    const logDir = path.join(config_1.rootDir(), 'logs');
    if (!fs.existsSync(logDir)) {
        fs.mkdirSync(logDir);
    }
}
const winstonConfig = config_1.Config().winston;
winston.setLevels({
    debug: 0,
    info: 1,
    warn: 2,
    error: 3,
});
winston.addColors({
    debug: 'blue',
    info: 'cyan',
    warn: 'yellow',
    error: 'red',
});
const logger = new (winston.Logger)({
    transports: [
        new (winston.transports.Console)({
            level: winstonConfig.consoleLevel,
            prettyPrint: true,
            colorize: true,
            silent: false,
            timestamp: () => moment(new Date()).format('YYYY-MM-DD hh:mm:ss'),
        }),
        new (RotateFile)({
            level: winstonConfig.fileLevel,
            prettyPrint: true,
            silent: false,
            colorize: false,
            filename: winstonConfig.filename,
            timestamp: () => moment(new Date()).format('YYYY-MM-DD hh:mm:ss'),
            json: false,
            maxFiles: 10,
            datePattern: 'yyyy-MM-dd.',
            prepend: true,
        }),
    ],
});
exports.default = logger;
//# sourceMappingURL=logger.js.map