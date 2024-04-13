import {Request, Response, NextFunction} from "express"
import {RestError} from "../../errors/rest-error";
import Config from "../../config/config";
import loggerUtils from "../../utils/logger.utils";


export class RequestErrorMiddleware {
    async validateErrors(error: Error & Partial<RestError>, req: Request, res: Response, next: NextFunction): Promise<void> {
        const statusCode: number = error?.statusCode || 500
        const message: string = error?.message || 'Aconteceu algum erro, tente novamente'
        const showErrorMessage: boolean = error?.showErrorMessage || false

        const name: string = error?.name
        const origin: string = error?.origin
        const stack: string = error?.stack
        const suggestion: string = error?.suggestion

        const isDevelopment: boolean = Config.NODE_ENV === 'development'

        if (!res.headersSent) {
            res.status(statusCode).json({
                message,
                showErrorMessage,
                name
            })
        } else {
            loggerUtils.error(`Error after headersSent, error log: ${error}`)
        }

        res["responseError"] = {
            statusCode,
            message,
            name,
            origin,
            showErrorMessage,
            stack,
            isDevelopment,
            suggestion
        }
    }
}