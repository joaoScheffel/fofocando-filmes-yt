import {IRequestLog} from "../types/request/request-log.types";
import {IncomingHttpHeaders} from "http";
import {EnumRequestEvent} from "../types/request/request-event.types";
import {EnumRequestEndpoint} from "../types/request/request-endpoint.types";
import {EnumRequestMethod} from "../types/request/request-method.types";
import {Request, Response} from "express";
import {UnauthorizedError} from "../errors/unauthorized-error";
import {authTokenRepository, googleApiService, requestLogRepository, userRepository} from "./factory";
import {RestError} from "../errors/rest-error";
import {uuidV4} from "./string.utils";
import {IUser} from "../types/user.types";
import {LoginTicket, TokenPayload} from "google-auth-library";

export class RequestLogUtils implements IRequestLog {
    requestUuid: string
    userUuid?: string

    requestUrl: string
    requestPath: string
    requestMethod: EnumRequestMethod
    requestHeaders: IncomingHttpHeaders
    requestBody: object
    requestQuery: object

    endpoint: EnumRequestEndpoint
    event: EnumRequestEvent

    requestStartedAt: Date

    requestFinishedAt: Date
    responseError: RestError
    responseStatus: number
    isResponseError: boolean

    constructor(req: Request) {
        if (!EnumRequestMethod[req?.method]) {
            throw new UnauthorizedError('Método não aceito')
        }

        if (req.url?.includes('/auth/generate-auth')) {
            this.endpoint = EnumRequestEndpoint.GENERATE_AUTH
            this.event = EnumRequestEvent.LOGIN_INIT

        } else if (req.url?.includes('/auth/redirect-google')) {
            this.endpoint = EnumRequestEndpoint.REDIRECT_GOOGLE
            this.event = EnumRequestEvent.LOGIN_DONE

        } else {
            if (!req?.headers?.endpoint) {
                throw new UnauthorizedError('Endpoint não informado no headers da requisição')
            } else if (!EnumRequestEndpoint[req?.headers?.endpoint[0]]) {
                throw new UnauthorizedError('Endpoint não é aceito no headers da requisição')
            }

            if (!req?.headers?.event) {
                throw new UnauthorizedError('Evento não informado no headers da requisição')
            } else if (!EnumRequestEndpoint[req?.headers?.event[0]]) {
                throw new UnauthorizedError('Evento não é aceito no headers da requisição')
            }

            this.endpoint = EnumRequestEndpoint[req?.headers?.endpoint[0]]
            this.event = EnumRequestEvent[req?.headers?.event[0]]
        }

        this.requestStartedAt = new Date()

        this.requestUuid = uuidV4()
        this.userUuid =

        this.requestMethod = EnumRequestMethod[req?.method]
        this.requestHeaders = req?.headers
        this.requestBody = req?.body
        this.requestQuery = req?.query
        this.requestUrl = req?.url
        this.requestPath = req?.path
    }

    async finishRequest(res: Response): Promise<void> {
        this.responseStatus = res?.statusCode
        this.isResponseError = this?.responseStatus > 200

        this.responseError = res["responseError"] || null
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
            responseError: this.responseError,
            userUuid: this.userUuid
        }

        await requestLogRepository.upsertRequestLog(config)
    }

    async getRequestUser(req: Request): Promise<IUser> {
        let user: IUser
        const token: string = req?.headers?.authorization

        if (!token) {
            return {} as IUser
        }

        if (!await authTokenRepository.getAuthTokenByToken(token)) {
            throw new UnauthorizedError('User token not found', '', true, "Autorização inválida, por favor faça login novamente")
        }

        const ticket: LoginTicket = await googleApiService.getTicketByIdToken(token)

        if (!ticket) {
            throw new UnauthorizedError('User ticket not found', '', true, "Autorização inválida, por favor faça login novamente")
        }

        const payload: TokenPayload = googleApiService.getPayloadFromTicket(ticket)

        if (!payload || !payload?.email) {
            throw new UnauthorizedError('User payload not found', '', true, "Autorização inválida, por favor faça login novamente")
        }

        user = await userRepository.findOneByEmail(payload?.email)

        return user
    }
}