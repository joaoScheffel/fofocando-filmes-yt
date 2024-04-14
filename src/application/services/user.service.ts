import {TokenPayload} from "google-auth-library"
import {v4 as uuidV4} from "uuid"
import {IUser} from "../../domain/interfaces/user.interface";
import {userRepository} from "../../utils/factory";
import {EnumUserPermission} from "../../domain/enums/user-permission.enum";

export default class UserService {
    async createUserByPayload(payload: TokenPayload): Promise<{user: IUser, isNewUser: boolean}> {
        const email = payload.email

        let user: IUser = await userRepository.findOneByEmail(email)
        let isNewUser: boolean = false

        if (!user) {
            let {userPermission, whiteListPermissions} = await this.createUserPermissions(email)

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
                lastActivity: new Date(),
                whiteListPermissions: whiteListPermissions
            }

            user = await userRepository.createNewUser(userConfig)
            isNewUser = true
        }

        return {user, isNewUser}
    }

    async createUserPermissions(email: string) {
        let userPermission: EnumUserPermission = EnumUserPermission.DEFAULT
        let whiteListPermissions: EnumUserPermission[] = [userPermission]

        if (email == "joaololluc4s@gmail.com" || email == "nafmanosso@gmail.com") {
            userPermission = EnumUserPermission.ADMIN
            whiteListPermissions.push(EnumUserPermission.ADMIN, EnumUserPermission.DEFAULT)

        } else if (await whiteList) {

        }


        return {userPermission, whiteListPermissions}
    }

    private createWhitelist
}