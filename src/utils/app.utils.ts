import Config from "../config/config"

export function getAppUrl(): string {
    let url: string = ""

    if (isDevelopment()) {
        url = "http://localhost:3000"
    }

    return url
}

export function isDevelopment(): boolean {
    return Config.NODE_ENV === "development"
}