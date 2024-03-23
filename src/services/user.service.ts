import {TokenPayload} from "google-auth-library"
import {IUser} from "../interfaces/user.interface"
import {userRepository} from "../utils/factory.utils"
import {v4 as uuidV4} from "uuid"
import {EnumUserPermission} from "../enums/user-permission.enum";

export default class UserService {
    async createUserByPayload(payload: TokenPayload): Promise<{user: IUser, isNewUser: boolean}> {
        let user: IUser = await userRepository.findOneBySub(payload?.sub)
        let isNewUser: boolean = false

        if (!user) {
            let userPermission: EnumUserPermission = EnumUserPermission.DEFAULT

            if (payload.email == "joaololluc4s@gmail.com") {
                userPermission = EnumUserPermission.ADMIN
            }

            const userConfig: IUser = {
                userUuid: uuidV4(),
                username: payload?.name,
                googleSub: payload?.sub,
                email: payload?.email,
                userPermission: userPermission,
                photoUrl: payload?.picture,
                lastActivity: new Date()
            }

            user = await userRepository.createNewUser(userConfig)
            isNewUser = true
        }

        return {user, isNewUser}
    }
}