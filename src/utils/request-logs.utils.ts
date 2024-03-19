import {Request, Response} from "express";
import {EnumRequestMethod} from "../types/request/request-method.types";
import {UnauthorizedError} from "../errors/unauthorized-error";
import {IncomingHttpHeaders} from "http";
import {EnumRequestEndpoint} from "../types/request/request-endpoint.types";
import {EnumRequestEvent} from "../types/request/request-event.types";
import {v4 as uuidV4} from 'uuid'
import {requestLogsRepository} from "./factory";
import {IRequestLogs} from "../types/request-logs.types";

export default class RequestLogsUtils implements IRequestLogs {
    readonly requestUuid: string

    readonly requestHeaders: IncomingHttpHeaders
    readonly requestMethod: EnumRequestMethod

    readonly requestUrl: string
    readonly requestPath: string
    readonly requestBody: any
    readonly requestQuery: any
    readonly requestOrigin: string

    readonly endpoint: EnumRequestEndpoint
    event: EnumRequestEvent

    readonly requestStartedAt: Date

    requestFinishedAt: Date | null = null
    responseStatus: number | null = null
    isResponseError: boolean

    constructor(req: Request) {
        if (!EnumRequestMethod[req?.method]) {
            throw new UnauthorizedError("Método não aceito")
        }

        if (req.url.includes('/auth/generate-auth')) {
            this.endpoint = EnumRequestEndpoint.GENERATE_AUTH
            this.event = EnumRequestEvent.LOGIN_INIT

        } else if (req.url.includes('/auth/redirect-google')) {
            this.endpoint = EnumRequestEndpoint.REDIRECT_GOOGLE
            this.event = EnumRequestEvent.LOGIN_DONE

        } else {
            if (!req?.headers?.endpoint) {
                throw new UnauthorizedError("Endpoint não informado")

            } else if (!EnumRequestEndpoint[req?.headers?.endpoint[0]]) {
                throw new UnauthorizedError("Endpoint não aceito")
            }

            this.endpoint = EnumRequestEndpoint[req.headers.endpoint[0]]

            if (!req?.headers?.event) {
                throw new UnauthorizedError("Evento não informado")

            } else if (!EnumRequestEndpoint[req?.headers?.event[0]]) {
                throw new UnauthorizedError("Evento não aceito")
            }

            this.event = EnumRequestEvent[req.headers.event[0]]
        }

        this.requestUuid = uuidV4()

        this.requestMethod = EnumRequestMethod[req.method]

        this.requestStartedAt = new Date()

        this.requestHeaders = req.headers

        this.requestUrl = req?.url
        this.requestPath = req?.path
        this.requestBody = req?.body
        this.requestQuery = req?.query
        this.requestOrigin = req?.headers?.origin
    }

    async finishRequest(res: Response) {
        this.responseStatus = res?.statusCode
        this.isResponseError = res?.statusCode >= 400

        this.requestFinishedAt = new Date()
        await this.upsertRequestLogs()
    }

    async upsertRequestLogs() {
        const config: IRequestLogs = {
            requestUuid: this.requestUuid,
            requestHeaders: this.requestHeaders,
            requestBody: this.requestBody,
            requestFinishedAt: this.requestFinishedAt,
            requestUrl: this.requestUrl,
            requestStartedAt: this.requestStartedAt,
            requestQuery: this.requestQuery,
            requestOrigin: this.requestOrigin,
            requestMethod: this.requestMethod,
            event: this.event,
            endpoint: this.endpoint,
            responseStatus: this.responseStatus,
            requestPath: this.requestPath,
            isResponseError: this.isResponseError
        }

        await requestLogsRepository.upsertRequestLogs(config)
    }
}