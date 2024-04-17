import {ITimesTamps} from "./timestamps.interface"
import {EnumUserPermission} from "../enums/user-permission.enum"
import {IWhitelist} from "./whitelist.interface"

export interface IUser extends ITimesTamps {
    userUuid: string
    username: string
    randomUsername?: string
    email: string

    photoUrl: string
    lastActivity: Date

    currentPermission: EnumUserPermission

    whitelist?: IWhitelist
    googleSub: string
}

