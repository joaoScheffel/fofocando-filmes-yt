import {RestError} from "./rest-error";

export class BadRequestError extends RestError {
    constructor(origin: string, suggestion: string = '', showErrorMessage: boolean = false, message: string = 'Aconteceu algum erro, tente novamente' ) {
        super(origin, message, 400, 'BadRequestError', showErrorMessage, suggestion)
    }
}