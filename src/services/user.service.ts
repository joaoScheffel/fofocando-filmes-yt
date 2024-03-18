import {TokenPayload} from "google-auth-library";
import {EnumUserPermission, IUser} from "../types/user.types";
import {userRepository} from "../utils/factory";
import {v4 as uuidV4} from 'uuid'

export default class UserService {
    async createUserByPayload(payload: TokenPayload) {
        let user: IUser = await userRepository.findOneBySub(payload?.sub)

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
                typePermission: userPermission,
                photoUrl: payload?.picture,
                lastActivity: new Date()
            }

            user = await userRepository.createNewUser(userConfig)
        }

        return user
    }
}