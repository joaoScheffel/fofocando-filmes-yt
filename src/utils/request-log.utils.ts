import {IncomingHttpHeaders} from "http"
import {Request, Response} from "express"
import {v4 as uuidV4} from "uuid"
import {IRequestLog} from "../domain/interfaces/request-log.interface"
import {EnumRequestMethod} from "../domain/enums/request/request-method.enum"
import {EnumRequestEndpoint} from "../domain/enums/request/request-endpoint.enum"
import {EnumRequestEvent} from "../domain/enums/request/request-event.enum"
import {BadRequestError} from "../domain/errors/bad-request-error"
import {requestLogRepository} from "../factory";

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
    errorFromValidateErrors: any

    req: Request
    res: Response

    constructor(req: Request, res: Response) {
        if (!EnumRequestMethod[req?.method]) {
            throw new BadRequestError("RequestLogUtils.constructor at !EnumRequestMethod[req?.method]",
                "Método não aceito")
        }

        if (req.url?.includes("/auth/generate-auth")) {
            this.endpoint = EnumRequestEndpoint.GENERATE_AUTH
            this.event = EnumRequestEvent.LOGIN_INIT

        } else if (req.url?.includes("/auth/redirect-google")) {
            this.endpoint = EnumRequestEndpoint.REDIRECT_GOOGLE
            this.event = EnumRequestEvent.LOGIN_DONE

        } else {
            if (!req?.headers?.endpoint) {
                throw new BadRequestError("RequestLogUtils.constructor at !EnumRequestMethod[req?.method]",
                    "Endpoint não informado no headers da requisição")

            } else if (!EnumRequestEndpoint[String(req?.headers?.endpoint)]) {
                throw new BadRequestError("RequestLogUtils.constructor at !EnumRequestEndpoint[req?.headers?.endpoint[0]]",
                    "Endpoint não é aceito no headers da requisição")

            }

            if (!req?.headers?.event) {
                throw new BadRequestError("RequestLogUtils.constructor at !req?.headers?.event",
                    "Evento não informado no headers da requisição")

            } else if (!EnumRequestEvent[String(req?.headers?.event)]) {
                throw new BadRequestError("RequestLogUtils.constructor at !EnumRequestEndpoint[req?.headers?.event[0]]",
                    "Evento não é aceito no headers da requisição")

            }

            this.endpoint = req?.headers?.endpoint as EnumRequestEndpoint
            this.event = req?.headers?.event as EnumRequestEvent
        }

        this.requestStartedAt = new Date()

        this.requestUuid = uuidV4()
        this.req = req
        this.res = res

        this.authToken = req?.headers?.authorization?.split('Bearer ')[1]
        this.requestMethod = EnumRequestMethod[req?.method]
        this.requestHeaders = req?.headers
        this.requestBody = req?.body
        this.requestQuery = req?.query
        this.requestUrl = req?.url
        this.requestPath = req?.path
        this.userUuid = null
    }

    async finishRequest(): Promise<void> {
        this.responseStatus = this.res.statusCode
        this.isResponseError = this.responseStatus >= 400
        this.requestFinishedAt = new Date()

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
            userUuid: this.userUuid,
            errorFromValidateErrors: this.res?.errorFromValidateErrors
        }

        await requestLogRepository.createRequestLog(config)
    }

    setUserUuidRequest(userUuid: string) {
        this.userUuid = userUuid
    }
}