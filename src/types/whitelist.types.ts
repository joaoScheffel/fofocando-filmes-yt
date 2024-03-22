import {ITimesTamps} from "./timestamps.types";
import {EnumUserPermission} from "./user.types";

export interface IWhitelist extends ITimesTamps {
    email: string
    typePermission: EnumUserPermission.ADMIN | EnumUserPermission.MASTER
}