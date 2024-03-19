import {ITimesTamps} from "./timestamps.types";
import {IncomingHttpHeaders} from "http";
import {EnumRequestMethod} from "./request/request-method.types";
import {EnumRequestEndpoint} from "./request/request-endpoint.types";
import {EnumRequestEvent} from "./request/request-event.types";

export interface IRequestLogs extends ITimesTamps {
    requestUuid: string

    requestHeaders: IncomingHttpHeaders
    requestMethod: EnumRequestMethod

    requestUrl: string
    requestPath: string
    requestBody: any
    requestQuery: any
    requestOrigin: string

    endpoint: EnumRequestEndpoint
    event: EnumRequestEvent

    requestStartedAt: Date

    requestFinishedAt?: Date
    responseStatus?: number
    isResponseError?: boolean

}