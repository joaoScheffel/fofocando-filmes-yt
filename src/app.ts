import "express-async-errors"
import express, {Express} from "express"
import morgan from "morgan"
import loggerUtils from "./utils/logger.utils"
import Routes from "./routes"
import {DbConfig} from "./infrastructure/database"
import Config from "./config/config"
import {RequestErrorMiddleware} from "./infrastructure/middlewares/request/request-error.middleware"
import {requestLogMiddleware} from "./infrastructure/middlewares/request/request-log.middleware"

class App {
    private _express: Express

    constructor() {
        this._express = express()
    }

    async mainConfiguration(): Promise<void> {
        Config.load()

        this.middlewares()
        await this.startDb()
        this.startRoutes()

        //This middleware must be before appListen
        this._express.use(new RequestErrorMiddleware().validateErrors)
        this.appListen()
    }

    private middlewares(): void {
        this._express.use(morgan("dev"))
        this._express.use(express.json())
        this._express.use(express.urlencoded({extended: true}))
        this._express.use(requestLogMiddleware)
    }

    private async startDb(): Promise<void> {
        await new DbConfig().initDatabase()
    }

    private startRoutes(): void {
        this._express.use(new Routes().initRoutes)
    }

    private appListen(): void {
        const port = Config.PORT
        this._express.listen(port, () => {
            loggerUtils.info(`Server started in http://localhost:${port}`)
        })
    }
}

new App().mainConfiguration()