import dotenv from 'dotenv'

export default class Config {
    static NODE_ENV: string
    static PORT: string

    static load(): void {
        dotenv.config()

        this.PORT = process.env.PORT || null
        this.NODE_ENV = process.env.NODE_ENV || null

        this.validateVariables()
    }

    private static validateVariables(): void {
        const requiredVariables: string[] = [
            'PORT',
            'NODE_ENV'
        ]

        for (const variable of requiredVariables) {
            if (!this[variable]) {
                throw new Error(`Environment variable ${variable} is not set!`)
            }
        }
    }
}