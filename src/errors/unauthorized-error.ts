import {RestError} from "./rest-error"

export class UnauthorizedError extends RestError {
    constructor(origin: string, showErrorMessage: boolean = false, message: string = 'Erro na autenticação, tente novamente', suggestion: string = '') {
        super(origin, message, 401, 'UnauthorizedError', showErrorMessage, suggestion)
    }
}