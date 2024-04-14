import {IncomingHttpHeaders} from "http"
import {Request, Response} from "express"
import {v4 as uuidV4} from "uuid"
import {requestLogRepository} from "./factory"
import {IRequestLog} from "../domain/interfaces/request-log.interface";
import {EnumRequestMethod} from "../domain/enums/request/request-method.enum";
import {EnumRequestEndpoint} from "../domain/enums/request/request-endpoint.enum";
import {EnumRequestEvent} from "../domain/enums/request/request-event.enum";
import {UnauthorizedError} from "../domain/errors/unauthorized-error";

export class RequestLogUtils implements IRequestLog {
    requestUuid: string
    userUuid: string

    requestUrl: string
    requestPath: string
    requestMethod: EnumRequestMethod
    requestHeaders: IncomingHttpHeaders
    requestBody: object
    requestQuery: object

    endpoint: EnumRequestEndpoint
    event: EnumRequestEvent

    requestStartedAt: Date

    authToken: string

    requestFinishedAt: Date
    responseStatus: number
    isResponseError: boolean

    constructor(req: Request) {
        if (!EnumRequestMethod[req?.method]) {
            throw new UnauthorizedError("Método não aceito")
        }

        if (req.url?.includes("/auth/generate-auth")) {
            this.endpoint = EnumRequestEndpoint.GENERATE_AUTH
            this.event = EnumRequestEvent.LOGIN_INIT

        } else if (req.url?.includes("/auth/redirect-google")) {
            this.endpoint = EnumRequestEndpoint.REDIRECT_GOOGLE
            this.event = EnumRequestEvent.LOGIN_DONE

        } else {
            if (!req?.headers?.endpoint) {
                throw new UnauthorizedError("Endpoint não informado no headers da requisição")
            } else if (!EnumRequestEndpoint[req?.headers?.endpoint[0]]) {
                throw new UnauthorizedError("Endpoint não é aceito no headers da requisição")
            }

            if (!req?.headers?.event) {
                throw new UnauthorizedError("Evento não informado no headers da requisição")
            } else if (!EnumRequestEndpoint[req?.headers?.event[0]]) {
                throw new UnauthorizedError("Evento não é aceito no headers da requisição")
            }

            this.endpoint = EnumRequestEndpoint[req?.headers?.endpoint[0]]
            this.event = EnumRequestEvent[req?.headers?.event[0]]
        }

        this.requestStartedAt = new Date()

        this.requestUuid = uuidV4()
        this.authToken = req?.headers?.authorization
        this.requestMethod = EnumRequestMethod[req?.method]
        this.requestHeaders = req?.headers
        this.requestBody = req?.body
        this.requestQuery = req?.query
        this.requestUrl = req?.url
        this.requestPath = req?.path
        this.userUuid = null
    }

    async finishRequest(res: Response): Promise<void> {
        this.responseStatus = res?.statusCode
        this.isResponseError = this.responseStatus > 200
        this.requestFinishedAt = new Date()

        await this.upsertRequestLog()
    }

    async upsertRequestLog(): Promise<void> {
        const config: IRequestLog = {
            requestUuid: this.requestUuid,
            requestHeaders: this.requestHeaders,
            requestBody: this.requestBody,
            requestFinishedAt: this.requestFinishedAt,
            requestUrl: this.requestUrl,
            requestStartedAt: this.requestStartedAt,
            requestQuery: this.requestQuery,
            requestMethod: this.requestMethod,
            event: this.event,
            endpoint: this.endpoint,
            responseStatus: this.responseStatus,
            requestPath: this.requestPath,
            isResponseError: this.isResponseError,
            userUuid: this.userUuid
        }

        await requestLogRepository.upsertRequestLog(config)
    }

    setUserUuidRequest(userUuid: string) {
        this.userUuid = userUuid
    }
}