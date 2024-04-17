import { RestError } from './rest-error'

export class BadRequestError extends RestError {
    constructor (origin: string, message: string, showMessageError: boolean = false, error?: any) {
        super(origin, message, 400, showMessageError, error)
        this.name = 'BadRequestError'
    }
}
