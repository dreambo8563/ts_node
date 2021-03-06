import * as winston from 'winston'
import * as path from 'path'
import * as fs from 'fs'
import * as moment from 'moment'
const RotateFile = require('winston-daily-rotate-file')
import { Config, env, rootDir } from '../config'

if (env() !== 'production') {
    const logDir = path.join(rootDir(), 'logs')
    if (!fs.existsSync(logDir)) {
        fs.mkdirSync(logDir)
    }
}

const winstonConfig = Config().winston

winston.setLevels({
    debug: 0,
    info: 1,
    warn: 2,
    error: 3,
})

winston.addColors({
    debug: 'blue',
    info: 'cyan',
    warn: 'yellow',
    error: 'red',
})

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
})

export default logger

