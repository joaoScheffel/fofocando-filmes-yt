export class RestError extends Error {
    readonly statusCode: number
    readonly name: string
    readonly origin: string
    readonly showErrorMessage: boolean
    readonly suggestion: string

    constructor(origin: string, message: string, statusCode: number, name: string, showErrorMessage: boolean, suggestion: string) {
        super(message)

        this.showErrorMessage = showErrorMessage || false
        this.statusCode = statusCode
        this.name = name
        this.origin = origin
        this.suggestion = suggestion
    }
}
