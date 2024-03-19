import { NextFunction, Request, Response } from 'express'
import RequestLogsUtils from "../utils/request-logs.utils";

export const requestLogsMiddleware = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    const requestLog = new RequestLogsUtils(req)
    req["requestUtils"] = requestLog

    await requestLog.upsertRequestLogs()

    res.on('finish', async () => {
        await req["requestUtils"].finishRequest(res)
    })

    next()
}