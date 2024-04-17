import {LoginTicket, OAuth2Client, TokenPayload} from "google-auth-library"
import {GetTokenResponse} from "google-auth-library/build/src/auth/oauth2client"
import Config from "../../config/config"
import {getAppUrl} from "../../utils/string.utils"
import {ServerError} from "../../domain/errors/server-error"
import {UnauthorizedError} from "../../domain/errors/unauthorized-error"
import {BadRequestError} from "../../domain/errors/bad-request-error"
import {googleApiService} from "../../factory";

export default class GoogleApiService {
    protected oauthClient: OAuth2Client

    constructor() {
        this.oauthClient = new OAuth2Client(Config.GOOGLE_AUTH_ID, Config.GOOGLE_AUTH_SECRET, getAppUrl() + "/auth/redirect-google")
    }

    generateAuthUrl(): string {
        try {
            return this.oauthClient.generateAuthUrl({
                access_type: "offline",
                scope: ["https://www.googleapis.com/auth/userinfo.email", "https://www.googleapis.com/auth/userinfo.profile"]
            })
        } catch (e) {
            throw new ServerError("GoogleApiService.generateAuthUrl at catch", e)
        }
    }

    async verifyCode(code: string): Promise<GetTokenResponse> {
        if (!code) throw new ServerError("GoogleApiService.verifyCode at !code", code)

        try {
            return  await this.oauthClient.getToken(code)

        } catch (e) {
            throw new UnauthorizedError("GoogleApiService.verifyCode at catch",
                "Token de acesso inválido ou expirado, realize login novamente", true, e)
        }
    }

    async verifyIdToken(idToken: string): Promise<LoginTicket> {
        if (!idToken) throw new ServerError("GoogleApiService.getTicketByIdToken at !idToken", idToken)

        try {
            return await this.oauthClient.verifyIdToken({idToken, audience: this.oauthClient._clientId})

        } catch (e) {
            if (e?.message?.includes("Token used too late")) {
                throw new UnauthorizedError("GoogleApiService.getTicketByIdToken at catch",
                    "Token de acesso expirado, realize login novamente", true, e)

            } else {
                throw new UnauthorizedError("GoogleApiService.getTicketByIdToken at catch",
                    "Token de acesso inválido, realize login novamente", true, e)
            }
        }

    }

    getPayloadFromTicket(ticket: LoginTicket): TokenPayload {
        if (!ticket) throw new ServerError("GoogleApiService.getPayloadFromTicket at !ticket", ticket)

        try {
            return ticket.getPayload()
        } catch (e) {
            throw new BadRequestError("GoogleApiService.getPayloadFromTicket at catch",
                "Error trying get payload from Google ticket", false, e)
        }
    }

    async getPayloadFromAuthToken(authToken: string): Promise<TokenPayload> {
        if (!authToken) throw new ServerError("GoogleApiService.getPayloadFromAuthToken at !authToken", authToken)

        const ticket: LoginTicket = await googleApiService.verifyIdToken(authToken)

        if (!ticket) {
            throw new BadRequestError("GoogleApiService.getPayloadFromAuthToken at !ticket",
                "Google user ticket not found")
        }

        return googleApiService.getPayloadFromTicket(ticket)
    }
}