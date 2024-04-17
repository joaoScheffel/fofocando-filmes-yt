import {Request, Response, NextFunction} from "express"
import {RestError} from "../../../domain/errors/rest-error"
import {isDevelopment} from "../../../utils/app.utils";


export class RequestErrorMiddleware {
    async validateErrors(error: Error & Partial<RestError>, req: Request, res: Response, next: NextFunction): Promise<void> {
        res.errorFromValidateErrors = error

        if (error instanceof RestError) {
            const statusCode: number = error.statusCode
            const message: string = error?.showMessageError || isDevelopment()? error.message : "Ocorreu um erro, tente novamente"

            res.status(statusCode).json({
                status: error.statusCode,
                message: message
            })

            res.end()
        } else {
            let errorMessage: string = "Internal Server Error"

            if (!!req?.requestUtils?.requestUuid) {
                errorMessage += ` - REQUEST-UUID: ${req?.requestUtils?.requestUuid}`
            }

            res.status(500).json({
                status: error.statusCode,
                message: errorMessage
            })
        }
    }
}