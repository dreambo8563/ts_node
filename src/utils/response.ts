import { Response } from 'express'

export function respondJSON(res: Response, result: boolean, data: object, statusCode?: number) {
    statusCode = statusCode || 200
    res.status(statusCode).json({
        success: result,
        timestamp: new Date().valueOf(),
        data,
    })
}
