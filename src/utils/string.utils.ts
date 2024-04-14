import Config from "../config/config"

export function getAppUrl(): string {
    let url: string = ""

    if (Config.NODE_ENV === "development") {
        url = "http://localhost:3000"
    }

    return url
}