export class RestError extends Error {
    readonly origin: string
    readonly statusCode: number
    readonly showMessageError: boolean
    readonly cause: any

    constructor (origin: string, message: string, statusCode: number, showMessageError: boolean, error?: any) {
        super(message)
        this.origin = origin
        this.statusCode = statusCode
        this.showMessageError = showMessageError
        this.cause = error
    }
}
