import {LoginTicket, OAuth2Client, TokenPayload} from "google-auth-library";
import Config from "../config/config";
import {getAppUrl} from "../utils/string.utils";
import {ServerError} from "../errors/server-error";
import {GetTokenResponse} from "google-auth-library/build/src/auth/oauth2client";
import {UnauthorizedError} from "../errors/unauthorized-error";

export default class GoogleApiService {
    protected oauthClient: OAuth2Client

    constructor() {
        this.oauthClient = new OAuth2Client(Config.GOOGLE_AUTH_ID, Config.GOOGLE_AUTH_SECRET, getAppUrl() + '/auth/redirect-google')
    }

    generateAuthUrl(): string {
        try {
            const url: string = this.oauthClient.generateAuthUrl({
                access_type: "offline",
                scope: ["https://www.googleapis.com/auth/userinfo.email", "https://www.googleapis.com/auth/userinfo.profile"]
            })

            return url
        } catch (e) {
            throw new ServerError("GoogleApiService.generateAuthUrl")
        }
    }

    async verifyCode(code: string): Promise<GetTokenResponse> {
        if (!code) {
            throw new ServerError('GoogleApiService.verifyCode')
        }

        let tokenResponse: GetTokenResponse

        try {
            tokenResponse = await this.oauthClient.getToken(code)
        } catch (e) {
            throw new UnauthorizedError('Invalid or expired code, please try again')
        }

        if (!tokenResponse) {
            throw new ServerError('GoogleApiService.verifyCode at !tokenResponse')
        }

        return tokenResponse
    }

    async getTicketFromTokenResponse(tokenResponse: GetTokenResponse): Promise<LoginTicket> {
        if (!tokenResponse) {
            throw new ServerError('GoogleApiService.getPayloadFromTokenResponse at !tokenResponse')
        }

        const idToken: string = tokenResponse?.tokens?.id_token

        if (!idToken) {
            throw new ServerError('GoogleApiService.getPayloadFromTokenResponse at !idToken')
        }

        let ticket: LoginTicket

        try {
            ticket = await this.oauthClient.verifyIdToken({idToken, audience: this.oauthClient._clientId})
        } catch (e) {
            throw new UnauthorizedError('Invalid Google id token')
        }

        if (!ticket) {
            throw new ServerError('GoogleApiService.getPayloadFromTokenResponse at !ticket')
        }

        return ticket
    }

    getPayloadFromTicket(ticket: LoginTicket): TokenPayload {
        if (!ticket) {
            throw new ServerError('GoogleApiService.getPayloadFromTicket at !ticket')
        }

        const userPayload: TokenPayload = ticket.getPayload()

        if (!userPayload) {
            throw new UnauthorizedError('User payload not found')
        }

        return userPayload
    }
}