import {RestError} from "./rest-error"

export class UnauthorizedError extends RestError {
    constructor (origin: string, message: string, showMessageError: boolean = false, error?: any) {
        super(origin, message, 401, showMessageError, error)
        this.name = 'UnauthorizedError'
    }
}