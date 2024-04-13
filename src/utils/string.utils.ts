import {v4 as v4} from 'uuid'
import Config from "../config/config";

export function getAppUrl(): string {
    let url: string = ''

    if (Config.NODE_ENV === 'development') {
        url = "http://localhost:3000"
    }

    return url
}

export function uuidV4(): string {
    return v4()
}