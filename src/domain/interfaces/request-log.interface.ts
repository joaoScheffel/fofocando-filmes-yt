import {IncomingHttpHeaders} from "http"
import {ITimesTamps} from "./timestamps.interface"
import {EnumRequestMethod} from "../enums/request/request-method.enum"
import {EnumRequestEndpoint} from "../enums/request/request-endpoint.enum"
import {EnumRequestEvent} from "../enums/request/request-event.enum"

export interface IRequestLog extends ITimesTamps {
    requestUuid: string
    userUuid: string

    requestHeaders: IncomingHttpHeaders
    requestMethod: EnumRequestMethod

    requestUrl: string
    requestPath: string
    requestBody: object
    requestQuery: object

    endpoint: EnumRequestEndpoint
    event: EnumRequestEvent

    requestStartedAt: Date

    authToken?: string

    requestFinishedAt?: Date
    responseStatus?: number
    isResponseError?: boolean
}