import {RestError} from "./rest-error"

export class ServerError extends RestError {
    constructor(origin: string) {
        super("Internal Server Error", 400, "ServerError", origin)
    }
}