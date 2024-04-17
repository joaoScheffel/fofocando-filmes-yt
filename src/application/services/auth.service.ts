import {Request} from "express"
import {TokenPayload} from "google-auth-library"
import {IAuthQueryParams} from "../../domain/interfaces/google-api.interface"
import {IUser} from "../../domain/interfaces/user.interface"
import {GetTokenResponse} from "google-auth-library/build/src/auth/oauth2client"
import {BadRequestError} from "../../domain/errors/bad-request-error"
import {UnauthorizedError} from "../../domain/errors/unauthorized-error"
import {ServerError} from "../../domain/errors/server-error"
import {EnumRequestEvent} from "../../domain/enums/request/request-event.enum"
import {EnumUserPermission} from "../../domain/enums/user-permission.enum"
import {ForbiddenError} from "../../domain/errors/forbidden-error"
import {authTokenRepository, googleApiService, userRepository, userService, whitelistService} from "../../factory";
import {RestError} from "../../domain/errors/rest-error";
import {IAuthToken} from "../../domain/interfaces/auth-token.interface";

export default class AuthService {
    async validateGoogleAuthRedirect(req: Request): Promise<{user: IUser, accessToken: string}> {
        const redirectQuery: IAuthQueryParams = req.query

        if (!redirectQuery.authuser || !redirectQuery.scope || !redirectQuery.code || !redirectQuery.prompt) {
            throw new BadRequestError("AuthService.validateGoogleAuthRedirect",
                "Google auth redirect query invalid!", false, redirectQuery)
        }

        const tokenResponse: GetTokenResponse = await googleApiService.verifyCode(redirectQuery.code)

        const accessToken: string = tokenResponse?.tokens?.id_token

        if (!accessToken) {
            throw new BadRequestError("AuthService.validateGoogleAuthRedirect at !accessToken",
                "Google access token not found at REDIRECT AUTH!", false, tokenResponse)
        }

        const userPayload: TokenPayload = await googleApiService.getPayloadFromAuthToken(accessToken)

        if (!userPayload?.email) {
            throw new BadRequestError("AuthService.validateGoogleAuthRedirect at !userPayload?.email",
                "User payload email not found at REDIRECT AUTH!", false, userPayload)
        }

        const {user, isNewUser} = await userService.createOrFindUser(userPayload)

        if (!user.userUuid) {
            throw new ServerError("AuthService.validateGoogleAuthRedirect at !user.userUuid",
                `Invalid createOrFindUser result user, user: ${user}\n\npayload: ${userPayload}`)
        }

        const authToken: IAuthToken = {
            ...tokenResponse?.tokens,
            userUuid: user?.userUuid
        }

        await authTokenRepository.upsertAuthToken(authToken)

        if (isNewUser) {
            req.requestUtils.event = EnumRequestEvent.REGISTER_USER
        }

        return {user, accessToken}
    }

    async validateUserPermission(req: Request, permissionsToVerify: EnumUserPermission[]): Promise<void> {
        const user: IUser = await this.validateAuthenticatedRequest(req)

        this.validateDynamicPermission(user, permissionsToVerify)
    }

    async validateAuthenticatedRequest(req: Request): Promise<IUser> {
        const bearerToken: string = req?.requestUtils?.authToken

        if (!bearerToken) throw new BadRequestError("AuthService.validateAuthorizedUser at !bearerToken",
            "Authorization Token not found")

        const authToken = await authTokenRepository.findOneByBearerToken(bearerToken)

        if (!authToken?.userUuid) throw new UnauthorizedError("AuthService.validateAuthorizedUser at !bearerToken",
            "Authorization Token not found in auth tokens collection")

        await googleApiService.verifyIdToken(bearerToken)

        const user: IUser = await userRepository.findOneByUserUuid(authToken.userUuid)

        if (!user?.email) throw new UnauthorizedError("AuthService.validateAuthorizedUser at !user?.email",
            "Usuário não encontrado, realize login novamente", true)

        if (user?.whitelist?.isBanned) throw new ForbiddenError('AuthService.validateAuthorizedUser at isBanned',
            "Email informado está banido, cadastre-se novamente", true)

        req.requestUtils.setUserUuidRequest(user.userUuid)

        return user
    }

    private validateDynamicPermission(user: IUser, permissionsToVerify: EnumUserPermission[]) {
        for (const permissionToVerify of permissionsToVerify) {
            if (!user?.whitelist?.allowedPermissions.includes(permissionToVerify)) {
                throw new UnauthorizedError("AuthService.validateDynamicPermission",
                    "Permissão para acessar recurso inválida", true)
            }
        }
    }
}