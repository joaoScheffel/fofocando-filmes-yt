import { RestError } from './rest-error'

export class ForbiddenError extends RestError {
    constructor (origin: string, message: string, showMessageError: boolean = false, error?: any) {
        super(origin, message, 403, showMessageError, error)
        this.name = 'ForbiddenError'
    }
}
