import {TokenPayload} from "google-auth-library"
import {v4 as uuidV4} from "uuid"
import {IUser} from "../../domain/interfaces/user.interface"
import {EnumUserPermission} from "../../domain/enums/user-permission.enum"
import {Request} from "express"
import {IWhitelist} from "../../domain/interfaces/whitelist.interface"
import {userRepository, whitelistService} from "../../factory";
import {ForbiddenError} from "../../domain/errors/forbidden-error";

export default class UserService {
    async createOrFindUser(payload: TokenPayload): Promise<{user: IUser, isNewUser: boolean}> {
        const email = payload.email

        if (await whitelistService.isBannedEmail(email)) {
            throw new ForbiddenError("UserService.createOrFindUser",
                'Email informado está banido, cadastre-se novamente', true)
        }

        let user: IUser = await userRepository.findOneByEmail(email)
        let isNewUser: boolean = false

        if (!user) {
            const whitelist: IWhitelist = await whitelistService.getWhitelistByEmail(email)

            const userConfig: IUser = {
                userUuid: uuidV4(),
                username: payload?.name,
                googleSub: payload?.sub,
                email: payload?.email,
                currentPermission: whitelist?.defaultPermission || EnumUserPermission.DEFAULT,
                photoUrl: payload?.picture,
                lastActivity: new Date(),
            }

            if (!!whitelist) {
                userConfig.whitelist = whitelist
            }

            user = await userRepository.createNewUser(userConfig)
            isNewUser = true
        }

        return {user, isNewUser}
    }

    async updateUser(req: Request) {
        const { userUuid, username, randomUsername } = req.body
        const files = req.files

        if (files?.files) {
            console.log('a')
        }
    }
}