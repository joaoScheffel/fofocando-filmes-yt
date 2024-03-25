import {NextFunction, Request, Response} from "express";
import {IAuthQueryParams} from "../types/google-api.types";
import {BadRequestError} from "../errors/bad-request-error";
import {GetTokenResponse} from "google-auth-library/build/src/auth/oauth2client";
import {UnauthorizedError} from "../errors/unauthorized-error";
import {LoginTicket, TokenPayload} from "google-auth-library";
import {authTokenRepository, googleApiService, userRepository, userService} from "../utils/factory";
import {IUser} from "../types/user.types";
import {ServerError} from "../errors/server-error";
import {IAuthToken} from "../types/auth-token.types";
import {EnumRequestEvent} from "../types/request/request-event.types";

export default class AuthService {
    async validateGoogleAuthRedirect(req: Request): Promise<{user: IUser, accessToken: string}> {
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

        const {user, isNewUser} = await userService.createUserByPayload(payload)

        if (!user) {
            throw new ServerError('AuthService.validateGoogleAuthRedirect at !user')
        }

        if (isNewUser) {
            req["requestUtils"].event = EnumRequestEvent.REGISTER_USER
        }

        const authToken: IAuthToken = {
            ...tokenResponse?.tokens,
            userUuid: user?.userUuid
        }

        await authTokenRepository.upsertAuthToken(authToken)

        const accessToken: string = tokenResponse?.tokens?.id_token

        return {user, accessToken}
    }

    async getLoggedInUser(req: Request) {
        const token: string = req?.headers?.authorization

        if (!token) {
            throw new UnauthorizedError('Authorization Token not found')
        }

        const ticket: LoginTicket = await googleApiService.getTicketByIdToken(token)

        if (!ticket) {
            throw new UnauthorizedError('User ticket not found')
        }

        const payload: TokenPayload = googleApiService.getPayloadFromTicket(ticket)

        if (!payload || !payload?.email) {
            throw new UnauthorizedError('User payload not found')
        }

        const user: IUser = await userRepository.findOneByEmail(payload?.email)

        if (!user) {
            throw new UnauthorizedError('User does not exist')
        }

        return user
    }
}