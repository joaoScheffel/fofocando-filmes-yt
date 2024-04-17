import {EnumUserPermission} from "../../domain/enums/user-permission.enum"
import {IWhitelist} from "../../domain/interfaces/whitelist.interface"
import {Request} from "express"
import {whiteListRepository} from "../../factory";

export default class WhitelistService {
    async createWhiteList(req: Request) {
        let {allowedPermissions, defaultPermission, email} = req?.body

        // TODO colocar validações no BODY


    }

    async getWhitelistByEmail(email: string): Promise<IWhitelist> {
        return await whiteListRepository.findOneByEmail(email)
    }

    getAllowedUserPermissions(userPermission: EnumUserPermission): EnumUserPermission[] {
        switch (userPermission) {
            case EnumUserPermission.ADMIN:
                return this.getAdminsAllowedPermissions()

            case EnumUserPermission.MASTER:
                return this.getMasterAllowedPermissions()

            default:
                return [EnumUserPermission.DEFAULT]
        }
    }

    async isBannedEmail (email: string): Promise<boolean> {
        const userWhiteList: IWhitelist = await whiteListRepository.findBannedEmail(email, true)

        return userWhiteList?.isBanned
    }

    private getAdminsAllowedPermissions(): EnumUserPermission[] {
        return [EnumUserPermission.ADMIN, EnumUserPermission.DEFAULT]
    }

    private getMasterAllowedPermissions(): EnumUserPermission[] {
        return [EnumUserPermission.MASTER, EnumUserPermission.ADMIN, EnumUserPermission.DEFAULT]
    }
}