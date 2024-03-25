export class RestError extends Error {
    readonly statusCode: number
    readonly name: string
    readonly origin?: string
    readonly showErrorMessage: boolean

    constructor(message: string, statusCode: number, name: string, showErrorMessage?: boolean, origin?: string) {
        super(message)

        this.showErrorMessage = showErrorMessage || false
        this.statusCode = statusCode
        this.name = name
        this.origin = origin
    }
}