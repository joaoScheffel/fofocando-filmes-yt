import {NextFunction, Request, Response} from "express"
import {TokenPayload} from "google-auth-library"
import {IAuthQueryParams} from "../../domain/interfaces/google-api.interface";
import {IUser} from "../../domain/interfaces/user.interface";
import {GetTokenResponse} from "google-auth-library/build/src/auth/oauth2client";
import {BadRequestError} from "../../domain/errors/bad-request-error";
import {googleApiService, userRepository, userService} from "../../utils/factory";
import {UnauthorizedError} from "../../domain/errors/unauthorized-error";
import {ServerError} from "../../domain/errors/server-error";
import {EnumRequestEvent} from "../../domain/enums/request/request-event.enum";
import {EnumUserPermission} from "../../domain/enums/user-permission.enum";

export default class AuthService {
    async validateGoogleAuthRedirect(req: Request): Promise<{user: IUser, accessToken: string}> {
        const redirectQuery: IAuthQueryParams = req.query

        if (!redirectQuery.authuser || !redirectQuery.scope || !redirectQuery.code || !redirectQuery.prompt) {
            throw new BadRequestError("Google auth redirect query invalid!")
        }

        const tokenResponse: GetTokenResponse = await googleApiService.verifyCode(redirectQuery.code)

        const accessToken: string = tokenResponse?.tokens?.id_token

        if (!accessToken) {
            throw new UnauthorizedError("User access token not found!")
        }

        const userPayload: TokenPayload = await googleApiService.getPayloadFromAuthToken(accessToken)

        if (!userPayload?.email) {
            throw new UnauthorizedError("User not found")
        }

        const {user, isNewUser} = await userService.createUserByPayload(userPayload)

        if (!user.userUuid) {
            throw new ServerError("AuthService.validateGoogleAuthRedirect at !user.userUuid")
        }

        if (isNewUser) {
            req["requestUtils"].event = EnumRequestEvent.REGISTER_USER
        }


        return {user, accessToken}
    }

    async validatePublicView(req: Request): Promise<void> {
        try {
            await this.getUserByRequest(req)
        } catch (e) {
            if (e !instanceof UnauthorizedError) {
                throw new ServerError(`AuthService.validateSiteAccess err is not UnauthorizedError`)
            }
        }
    }

    async validateUserAuth(req: Request, permissionsToVerify: EnumUserPermission[]): Promise<void> {
        const user: IUser = await this.getUserByRequest(req)

        this.validateDynamicPermission(user, permissionsToVerify)
    }

    // ver para trocar o tipo de permissao usando a whitelist, qualquer usuario com mais de uma permissao poderia trocar e acessar os recursos

    private async getUserByRequest(req: Request): Promise<IUser> {
        const authToken: string = req["requestUtils"]?.authToken

        if (!authToken) throw new UnauthorizedError("Authorization Token not found")

        const payload: TokenPayload = await googleApiService.getPayloadFromAuthToken(authToken)

        if (!payload || !payload?.sub) {
            throw new UnauthorizedError("User payload not found")
        }

        const user: IUser = await userRepository.findOneBySub(payload?.sub)

        if (!user) {
            throw new UnauthorizedError("User not found")
        }

        req["requestUtils"]?.setUserUuidRequest(user.userUuid)

        return user
    }

    private validateDynamicPermission(user: IUser, permissionsToVerify: EnumUserPermission[]) {
        for (const permissionToVerify of permissionsToVerify) {
            if (!user.whiteListPermissions.includes(permissionToVerify)) {
                throw new UnauthorizedError("Invalid user permission.")
            }
        }
    }
}