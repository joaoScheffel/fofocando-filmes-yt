import {RestError} from "./rest-error"

export class UnauthorizedError extends RestError {
    constructor(origin: string, suggestion: string = '', showErrorMessage: boolean = false, message: string = 'Aconteceu algum erro, tente novamente') {
        super(origin, message, 401, 'UnauthorizedError', showErrorMessage, suggestion)
    }
}