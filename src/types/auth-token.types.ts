import {ITimesTamps} from "./timestamps.types";
import {CredentialRequest} from 'google-auth-library'

export interface IAuthToken extends ITimesTamps, CredentialRequest {
    _id?: string
    userUuid: string
}