import {ITimesTamps} from "../timestamps.types";
import {IncomingHttpHeaders} from "http";
import {EnumRequestEndpoint} from "./request-endpoint.types";
import {EnumRequestEvent} from "./request-event.types";
import {EnumRequestMethod} from "./request-method.types";
import {RestError} from "../../errors/rest-error";

export interface IRequestLog extends ITimesTamps {
    requestUuid: string
    userUuid?: string

    requestHeaders: IncomingHttpHeaders
    requestMethod: EnumRequestMethod

    requestUrl: string
    requestPath: string
    requestBody: object
    requestQuery: object

    endpoint: EnumRequestEndpoint
    event: EnumRequestEvent

    requestStartedAt: Date

    isResponseError?: boolean
    responseError?: RestError
    responseStatus?: number
    requestFinishedAt?: Date
}