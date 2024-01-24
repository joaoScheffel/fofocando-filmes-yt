import {OAuth2Client} from "google-auth-library";
import Config from "../config/config";
import {getAppUrl} from "../utils/string.utils";
import {ServerError} from "../errors/server-error";

export default class GoogleApiService {
    protected oauthClient: OAuth2Client

    constructor() {
        Config.load()
        this.oauthClient = new OAuth2Client(Config.GOOGLE_AUTH_ID, Config.GOOGLE_AUTH_SECRET, getAppUrl() + '/auth/redirect-google')
    }

    generateAuthUrl(): string {
        try {
            const url: string = this.oauthClient.generateAuthUrl({
                access_type: "offline",
                scope: ["https://www.googleapis.com/auth/userinfo.email", "https://www.googleapis.com/auth/userinfo.profile"]
            })

            return url
        } catch (e) {
            throw new ServerError("GoogleApiService.generateAuthUrl")
        }
    }
}