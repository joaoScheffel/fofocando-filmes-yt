import dotenv from "dotenv"

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
            "DATABASE_URL",
            "GOOGLE_AUTH_ID",
            "GOOGLE_AUTH_SECRET"
        ]

        for (const variable of requiredVariables) {
            if (!this[variable]) {
                throw new Error(`Environment variable is not set: ${variable}`)
            }
        }

        const numberVariables: string[] = [
            "PORT"
        ]

        for (const numberVariable of numberVariables) {
            if (isNaN(this[numberVariable])) {
                throw new Error(`Environment variable must be a number: ${numberVariable}`)
            }
        }
    }
}