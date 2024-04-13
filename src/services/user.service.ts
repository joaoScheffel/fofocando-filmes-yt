import {TokenPayload} from "google-auth-library";
import {EnumUserPermission, IUser} from "../types/user.types";
import {userRepository, whitelistRepository} from "../utils/factory";
import {IWhitelist} from "../types/whitelist.types";
import {UnauthorizedError} from "../errors/unauthorized-error";
import {uuidV4} from "../utils/string.utils";

export default class UserService {
    async createUserByPayload(payload: TokenPayload): Promise<{user: IUser, isNewUser: boolean}> {
        let user: IUser = await userRepository.findOneByEmail(payload?.email)
        let isNewUser: boolean = false

        if (!user) {
            let userPermission: EnumUserPermission = EnumUserPermission.DEFAULT
            let isInternalUser: boolean = false

            const whiteListUser: IWhitelist = await whitelistRepository.findOneByEmail(payload.email)

            if (whiteListUser?.isBanned) {
                throw new UnauthorizedError('User is banned, please contact support', 'whiteListUser?.isBanned')
            } else if (whiteListUser) {
                userPermission = whiteListUser?.typePermission
                isInternalUser = true
            }

            const userConfig: IUser = {
                userUuid: uuidV4(),
                username: payload?.name,
                googleSub: payload?.sub,
                email: payload?.email,
                typePermission: userPermission,
                isInternalUser: isInternalUser,
                photoUrl: payload?.picture,
                lastActivity: new Date()
            }

            user = await userRepository.createNewUser(userConfig)

            isNewUser = true
        }

        return {user, isNewUser}
    }
}