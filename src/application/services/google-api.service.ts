import {LoginTicket, OAuth2Client, TokenPayload} from "google-auth-library"
import {GetTokenResponse} from "google-auth-library/build/src/auth/oauth2client"
import Config from "../../config/config";
import {getAppUrl} from "../../utils/string.utils";
import {ServerError} from "../../domain/errors/server-error";
import {UnauthorizedError} from "../../domain/errors/unauthorized-error";
import {googleApiService} from "../../utils/factory";

export default class GoogleApiService {
    protected oauthClient: OAuth2Client

    constructor() {
        this.oauthClient = new OAuth2Client(Config.GOOGLE_AUTH_ID, Config.GOOGLE_AUTH_SECRET, getAppUrl() + "/auth/redirect-google")
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
            throw new ServerError("GoogleApiService.verifyCode")
        }

        let tokenResponse: GetTokenResponse

        try {
            tokenResponse = await this.oauthClient.getToken(code)
        } catch (e) {
            throw new UnauthorizedError("Invalid or expired code, please try again")
        }

        return tokenResponse
    }

    async getTicketByIdToken(idToken: string): Promise<LoginTicket> {
        if (!idToken) {
            throw new ServerError("GoogleApiService.getTicketByIdToken at !idToken")
        }

        let ticket: LoginTicket

        try {
            ticket = await this.oauthClient.verifyIdToken({idToken, audience: this.oauthClient._clientId})
        } catch (e) {
            if (e?.message?.includes("Token used too late")) {
                throw new UnauthorizedError("Expired access token")
            } else {
                throw new UnauthorizedError("Invalid access token")
            }
        }

        return ticket
    }

    getPayloadFromTicket(ticket: LoginTicket): TokenPayload {
        if (!ticket) {
            throw new ServerError("GoogleApiService.getPayloadFromTicket at !ticket")
        }

        try {
            return ticket.getPayload()
        } catch (e) {

        }
    }

    async getPayloadFromAuthToken(authToken: string) {
        if (!authToken) throw new ServerError("GoogleApiService.getPayloadFromAuthToken at !authToken")

        const ticket: LoginTicket = await googleApiService.getTicketByIdToken(authToken)

        if (!ticket) {
            throw new UnauthorizedError("User ticket not found")
        }

        return googleApiService.getPayloadFromTicket(ticket)
    }
}