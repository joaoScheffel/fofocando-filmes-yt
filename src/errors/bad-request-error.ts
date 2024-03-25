import {RestError} from "./rest-error";

export class BadRequestError extends RestError {
    constructor(origin: string, showErrorMessage: boolean = false, message: string = 'Ocorreu algum erro, tente novamente', suggestion: string = '') {
        super(origin, message, 400, 'BadRequestError', showErrorMessage, suggestion)
    }
}