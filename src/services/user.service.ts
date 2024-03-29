import {TokenPayload} from "google-auth-library";
import {EnumUserPermission, IUser} from "../types/user.types";
import {userRepository} from "../utils/factory";
import {v4 as uuidV4} from 'uuid'

export default class UserService {
    async createUserByPayload(payload: TokenPayload): Promise<{user: IUser, isNewUser: boolean}> {
        let user: IUser = await userRepository.findOneByEmail(payload?.email)
        let isNewUser: boolean = false

        if (!user) {
            let userPermission: EnumUserPermission = EnumUserPermission.DEFAULT

            if (payload.email == "joaololluc4s@gmail.com" || payload.email === "nafmanosso@gmail.com") {
                userPermission = EnumUserPermission.MASTER
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
            isNewUser = true
        }

        return {user, isNewUser}
    }
}