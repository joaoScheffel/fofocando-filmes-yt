import dotenv from 'dotenv'

export default class Config {
    static NODE_ENV: string
    static PORT: string
    static DATABASE_URL: string
    static GOOGLE_AUTH_ID: string
    static GOOGLE_AUTH_SECRET: string

    static load(): void {
        dotenv.config()

        this.PORT = process.env.PORT || null
        this.NODE_ENV = process.env.NODE_ENV || null
        this.DATABASE_URL = process.env.DATABASE_URL || null
        this.GOOGLE_AUTH_ID = process.env.GOOGLE_AUTH_ID || null
        this.GOOGLE_AUTH_SECRET = process.env.GOOGLE_AUTH_SECRET || null

        this.validateVariables()
    }

    private static validateVariables(): void {
        const requiredVariables: string[] = [
            'PORT',
            'NODE_ENV',
            'DATABASE_URL',
            'GOOGLE_AUTH_ID',
            'GOOGLE_AUTH_SECRET'
        ]

        for (const variable of requiredVariables) {
            if (!this[variable]) {
                throw new Error(`Environment variable ${variable} is not set!`)
            }
        }
    }
}