import {ITimesTamps} from "./timestamps.types";

export interface IUser extends ITimesTamps {
    _id?: string
    userUuid: string
    username: string
    email: string

    photoUrl: string
    lastActivity: Date

    typePermission: EnumUserPermission
    isInternalUser: boolean
    googleSub: string
}

export enum EnumUserPermission {
    DEFAULT = "DEFAULT",
    ADMIN = "ADMIN",
    MASTER = "MASTER"
}