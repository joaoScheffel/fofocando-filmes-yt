import 'express-async-errors'
import express, {Express} from "express"
import morgan from 'morgan'
import Config from "./config/config";
import loggerUtils from "./utils/logger.utils";
import {DbConfig} from "./config/db.config";
import {RequestErrorMiddleware} from "./middlewares/request-error.middleware";
import Routes from "./routes";

class App {
    private _express: Express

    constructor() {
        this._express = express()
    }

    mainConfiguration(): void {
        Config.load()

        this.middlewares()
        this.startDb()
        this.startRoutes()

        //This middleware must be before appListen
        this._express.use(new RequestErrorMiddleware().validateErrors)
        this.appListen()
    }

    private middlewares(): void {
        this._express.use(morgan('dev'))
        this._express.use(express.json())
        this._express.use(express.urlencoded({extended: true}))
    }

    private startDb(): void {
        new DbConfig()
    }

    private startRoutes(): void {
        loggerUtils.debug('Setting routes.')
        this._express.use(new Routes().mainConfiguration)
        loggerUtils.info('Successfully configured routes!')
    }

    private appListen(): void {
        const port = Config.PORT
        this._express.listen(port, () => {
            loggerUtils.info(`Server started in http://localhost:${port}`)
        })
    }
}

new App().mainConfiguration()