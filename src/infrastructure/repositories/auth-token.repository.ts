import {model, Schema} from "mongoose"
import {IAuthToken} from "../../domain/interfaces/auth-token.interface";
import {ServerError} from "../../domain/errors/server-error";
import {BadRequestError} from "../../domain/errors/bad-request-error";


const authTokenSchema: Schema = new Schema<IAuthToken>({
    userUuid: {
        type: String,
        required: [true, "userUuid in authTokenSchema not found"],
        unique: true
    },
    id_token: {
        type: String,
        required: [true, "id_token in authTokenSchema not found"]
    },
    access_token: {
        type: String,
        required: [true, "access_token in authTokenSchema not found"],
        unique: true
    },
    refresh_token: {
        type: String,
        required: [true, "refresh_token in authTokenSchema not found"],
        unique: true
    },
    scope: {
        type: String,
        required: [true, "scope in authTokenSchema not found"]
    },
    token_type: {
        type: String,
        required: [true, "token_type in authTokenSchema not found"]
    },
    expires_in: {
        type: Number,
        required: [true, "expires_in in authTokenSchema not found"]
    }
}, {timestamps: true})

const authTokenCollection = model<IAuthToken>("authTokenCollection", authTokenSchema,  "auth-tokens")

export class AuthTokenRepository {
    async upsertAuthToken(config: IAuthToken): Promise<IAuthToken> {
        if (!config) throw new ServerError("AuthTokenRepository.upsertAuthToken at !config",
            "config for upsertAuthToken not found")

        try {
            return await authTokenCollection.findOneAndUpdate({userUuid: config?.userUuid},
                {$set: config},
                {upsert: true, new: true, runValidators: true}
            )
        } catch (e) {
            throw new BadRequestError("AuthTokenRepository.upsertAuthToken at catch", `${e}`)
        }
    }

    async findOneByBearerToken(bearerToken: string) {
        if (!bearerToken?.length) throw new ServerError("AuthTokenRepository.findOneByBearerToken at !bearerToken",
            "bearerToken for findOneByBearerToken not found")

        try {
            return await authTokenCollection.findOne({id_token: bearerToken})
        } catch (e) {
            throw new BadRequestError("AuthTokenRepository.findOneByBearerToken at catch", `${e}`)
        }
    }
}