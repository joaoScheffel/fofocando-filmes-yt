import {Request, Response, NextFunction} from "express"
import {RestError} from "../errors/rest-error"
import Config from "../config/config"
import loggerUtils from "../utils/logger.utils"

export class RequestErrorMiddleware {
    async validateErrors(error: Error & Partial<RestError>, req: Request, res: Response, next: NextFunction): Promise<void> {
        const statusCode: number = error?.statusCode || 500
        const message: string = error?.message || "Internal Server Error"
        const name: string = error?.name
        const origin: string = error?.origin
        const stack: string = error?.stack

        const isDevelopment: boolean = Config.NODE_ENV === "development"

        if (!res.headersSent) {
            res.status(statusCode).json({
                message,
                name,
                stack: isDevelopment? stack : null,
                origin
            })

            return
        } else {
            loggerUtils.error(`Error after headersSent, error log: ${error}`)
        }
    }
}