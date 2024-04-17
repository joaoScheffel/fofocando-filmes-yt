import {RestError} from "./rest-error"

export class ServerError extends RestError {
    constructor (origin: string, error: any, showMessageError: boolean = false) {
        super(origin, 'Internal server error', 500, showMessageError, error)
        this.name = 'ServerError'
    }
}