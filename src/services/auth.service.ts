import {Request} from "express";
import {IAuthQueryParams} from "../types/google-api.types";
import {BadRequestError} from "../errors/bad-request-error";
import {GetTokenResponse} from "google-auth-library/build/src/auth/oauth2client";
import {UnauthorizedError} from "../errors/unauthorized-error";
import {LoginTicket, TokenPayload} from "google-auth-library";
import {googleApiService, userService} from "../utils/factory";
import {IUser} from "../types/user.types";
import {ServerError} from "../errors/server-error";

export default class AuthService {
    async validateGoogleAuthRedirect(req: Request): Promise<IUser> {
        const redirectQuery: IAuthQueryParams = req.query

        if (!redirectQuery.authuser || !redirectQuery.scope || !redirectQuery.code || !redirectQuery.prompt) {
            throw new BadRequestError('Google auth redirect query invalid!')
        }

        const tokenResponse: GetTokenResponse = await googleApiService.verifyCode(redirectQuery.code)

        if (!tokenResponse?.tokens?.access_token) {
            throw new UnauthorizedError('User access token not found!')
        }

        const ticket: LoginTicket = await googleApiService.getTicketFromTokenResponse(tokenResponse)

        const payload: TokenPayload = googleApiService.getPayloadFromTicket(ticket)

        const user: IUser = await userService.createUserByPayload(payload)

        if (!user) {
            throw new ServerError('AuthService.validateGoogleAuthRedirect at !user')
        }

        return user
    }
}