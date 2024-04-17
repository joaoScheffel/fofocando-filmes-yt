import {NextFunction, Request, Response} from "express"
import {RequestLogUtils} from "../../../utils/request-log.utils"


export async function requestLogMiddleware (req: Request, res: Response, next: NextFunction) {
    req.requestUtils = new RequestLogUtils(req, res)

    res.on("finish", async () => {
        await req.requestUtils.finishRequest()
    })

    next()
}