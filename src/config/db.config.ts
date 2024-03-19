import mongoose from 'mongoose'
import Config from "./config";
import loggerUtils from "../utils/logger.utils";

export class DbConfig {
    protected uri: string

    constructor() {
        Config.load()

        this.uri = Config.DATABASE_URL + 'coding'
    }

    async mainConfiguration(): Promise<void> {
        loggerUtils.debug('Starting db configuration.')

        try {
            await mongoose.connect(this.uri)
            loggerUtils.info('Successfully connected to database!')
        } catch (e) {
            loggerUtils.error(`Error trying to connect to database, error log: ${e}`)
        }
    }
}