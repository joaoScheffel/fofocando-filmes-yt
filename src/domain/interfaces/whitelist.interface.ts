import {ITimesTamps} from "./timestamps.interface"
import {EnumUserPermission} from "../enums/user-permission.enum"

export interface IWhitelist extends ITimesTamps {
    email: string
    allowedPermissions: EnumUserPermission[]
    defaultPermission: EnumUserPermission
    isBanned?: boolean
}