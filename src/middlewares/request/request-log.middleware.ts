import {NextFunction, Request, Response} from "express";
import {RequestLogUtils} from "../../utils/request-log.utils";


export async function requestLogMiddleware (req: Request, res: Response, next: NextFunction) {
    const requestUtils: RequestLogUtils = new RequestLogUtils(req)

    req["requestUtils"] = requestUtils
    req["requestUtils"].userUuid = await (await req["requestUtils"].getRequestUser(req))?.userUuid || null

    await requestUtils.upsertRequestLog()

    res.on("finish", async () => {
        await requestUtils.finishRequest(res)
    })

    next()
}