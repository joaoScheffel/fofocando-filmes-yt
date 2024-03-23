import {NextFunction, Request, Response} from "express"
import {RequestLogUtils} from "../utils/request-log.utils"


export async function requestLogMiddleware (req: Request, res: Response, next: NextFunction) {
    const requestUtils: RequestLogUtils = new RequestLogUtils(req)
    req["requestUtils"] = requestUtils

    await requestUtils.upsertRequestLog()

    res.on("finish", async () => {
        await requestUtils.finishRequest(res)
    })

    next()
}