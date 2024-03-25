import {ITimesTamps} from "./timestamps.interface"
import {EnumUserPermission} from "../enums/user-permission.enum"

export interface IUser extends ITimesTamps {
    userUuid: string
    username: string
    email: string

    photoUrl: string
    lastActivity: Date

    userPermission: EnumUserPermission
    googleSub: string
}

