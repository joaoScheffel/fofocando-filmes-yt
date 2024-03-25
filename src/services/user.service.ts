import {TokenPayload} from "google-auth-library";
import {EnumUserPermission, IUser} from "../types/user.types";
import {userRepository, whitelistRepository} from "../utils/factory";
import {v4 as uuidV4} from 'uuid'
import {IWhitelist} from "../types/whitelist.types";

export default class UserService {
    async createUserByPayload(payload: TokenPayload): Promise<{user: IUser, isNewUser: boolean}> {
        let user: IUser = await userRepository.findOneByEmail(payload?.email)
        let isNewUser: boolean = false

        if (!user) {
            let userPermission: EnumUserPermission = EnumUserPermission.DEFAULT
            let isInternalUser: boolean = false

            const whiteListUser: IWhitelist = await whitelistRepository.findOneByEmail(payload.email)

            if (whiteListUser) {
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