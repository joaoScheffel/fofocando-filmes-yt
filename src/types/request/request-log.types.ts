import {ITimesTamps} from "../timestamps.types";
import {IncomingHttpHeaders} from "http";
import {EnumRequestEndpoint} from "./request-endpoint.types";
import {EnumRequestEvent} from "./request-event.types";
import {EnumRequestMethod} from "./request-method.types";

export interface IRequestLog extends ITimesTamps {
    requestUuid: string

    requestHeaders: IncomingHttpHeaders
    requestMethod: EnumRequestMethod

    requestUrl: string
    requestPath: string
    requestBody: object
    requestQuery: object

    endpoint: EnumRequestEndpoint
    event: EnumRequestEvent

    requestStartedAt: Date

    requestFinishedAt?: Date
    responseStatus?: number
    isResponseError?: boolean
}