import {Request} from "express"
import {IAuthQueryParams} from "../interfaces/google-api.interface"
import {BadRequestError} from "../errors/bad-request-error"
import {GetTokenResponse} from "google-auth-library/build/src/auth/oauth2client"
import {UnauthorizedError} from "../errors/unauthorized-error"
import {LoginTicket, TokenPayload} from "google-auth-library"
import {authTokenRepository, googleApiService, userService} from "../utils/factory"
import {IUser} from "../interfaces/user.interface"
import {ServerError} from "../errors/server-error"
import {IAuthToken} from "../interfaces/auth-token.interface"
import {EnumRequestEvent} from "../enums/request/request-event.enum"

export default class AuthService {
    async validateGoogleAuthRedirect(req: Request): Promise<{user: IUser, accessToken: string}> {
        const redirectQuery: IAuthQueryParams = req.query

        if (!redirectQuery.authuser || !redirectQuery.scope || !redirectQuery.code || !redirectQuery.prompt) {
            throw new BadRequestError("Google auth redirect query invalid!")
        }

        const tokenResponse: GetTokenResponse = await googleApiService.verifyCode(redirectQuery.code)

        if (!tokenResponse?.tokens?.id_token) {
            throw new UnauthorizedError("User access token not found!")
        }

        const ticket: LoginTicket = await googleApiService.getTicketFromTokenResponse(tokenResponse)

        const payload: TokenPayload = googleApiService.getPayloadFromTicket(ticket)

        const {user, isNewUser} = await userService.createUserByPayload(payload)

        if (!user) {
            throw new ServerError("AuthService.validateGoogleAuthRedirect at !user")
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
}