import {Request} from "express";
import {IAuthQueryParams} from "../types/google-api.types";
import {BadRequestError} from "../errors/bad-request-error";
import {GetTokenResponse} from "google-auth-library/build/src/auth/oauth2client";
import GoogleApiService from "./google-api.service";
import {UnauthorizedError} from "../errors/unauthorized-error";
import {LoginTicket, TokenPayload} from "google-auth-library";

export default class AuthService {
    async validateGoogleAuthRedirect(req: Request): Promise<TokenPayload> {
        const redirectQuery: IAuthQueryParams = req.query

        if (!redirectQuery.authuser || !redirectQuery.scope || !redirectQuery.code || !redirectQuery.prompt) {
            throw new BadRequestError('Google auth redirect query invalid!')
        }

        const tokenResponse: GetTokenResponse = await new GoogleApiService().verifyCode(redirectQuery.code)

        if (!tokenResponse?.tokens?.access_token) {
            throw new UnauthorizedError('User access token not found!')
        }

        const ticket: LoginTicket = await new GoogleApiService().getTicketFromTokenResponse(tokenResponse)

        const payload: TokenPayload = new GoogleApiService().getPayloadFromTicket(ticket)

        return payload
    }
}