import {ITimesTamps} from "./timestamps.types";
import {EnumUserPermission} from "./user.types";

export interface IWhitelist extends ITimesTamps {
    whiteListUuid: string
    email: string
    typePermission: EnumUserPermission.ADMIN | EnumUserPermission.MASTER,
    isBanned?: boolean
}