import dotenv from "dotenv"
import loggerUtils from "../utils/logger.utils"

export default class Config {
    static NODE_ENV: string
    static PORT: number | string
    static MONGOOSE_URI: string
    static GOOGLE_AUTH_ID: string
    static GOOGLE_AUTH_SECRET: string

    static load(): void {
        dotenv.config()

        this.PORT = process.env.PORT || null
        this.NODE_ENV = process.env.NODE_ENV || null
        this.MONGOOSE_URI = process.env.MONGOOSE_URI || null
        this.GOOGLE_AUTH_ID = process.env.GOOGLE_AUTH_ID || null
        this.GOOGLE_AUTH_SECRET = process.env.GOOGLE_AUTH_SECRET || null

        this.validateVariables()
    }

    private static validateVariables(): void {
        const requiredVariables: string[] = [
            "PORT",
            "NODE_ENV",
            "MONGOOSE_URI",
            "GOOGLE_AUTH_ID",
            "GOOGLE_AUTH_SECRET"
        ]

        for (const variable of requiredVariables) {
            if (!this[variable]) {
                loggerUtils.error(`Environment variable is not set: ${variable}`)
                throw new Error(`Environment variable is not set: ${variable}`)
            }
        }

        const numberVariables: string[] = [
            "PORT"
        ]

        for (const numberVariable of numberVariables) {
            if (isNaN(this[numberVariable])) {
                loggerUtils.error(`Environment variable must be a number: ${numberVariable}`)
                throw new Error(`Environment variable must be a number: ${numberVariable}`)
            }
        }
    }
}