import mongoose from "mongoose"
import loggerUtils from "../utils/logger.utils"
import Config from "../config/config"

export class DbConfig {
    protected mongooseUri: string

    constructor() {
        Config.load()

        this.mongooseUri = Config.MONGOOSE_URI
    }

    async initDatabase(): Promise<void> {
        await this.initMongoose()
    }

    private async initMongoose(): Promise<void> {
        loggerUtils.debug("Starting mongoose database.")
        try {
            await mongoose.connect(this.mongooseUri)
            loggerUtils.info("Successfully connected to mongoose database!")
        } catch (e) {
            loggerUtils.error(`Error trying to connect to mongoose database, error log: ${e}`)
            throw e
        }
    }
}