import {model, Schema} from "mongoose"
import {ServerError} from "../errors/server-error"
import {BadRequestError} from "../errors/bad-request-error"
import {IWhitelist} from "../types/whitelist.types"
import {EnumUserPermission} from "../types/user.types"

const whitelistSchema: Schema = new Schema<IWhitelist>({
    email: {
        type: String,
        required: [true, 'email in whitelistSchema not found'],
        unique: true
    },
    typePermission: {
        type: String,
        required: [true, 'typePermission in whitelistSchema not found'],
        enum: [EnumUserPermission.MASTER, EnumUserPermission.ADMIN]
    }
}, {timestamps: true})

const whitelistCollection = model<IWhitelist>('whitelist', whitelistSchema,  'whitelist')

export class WhitelistRepository {
    async upsertWhitelist(config: IWhitelist): Promise<IWhitelist> {
        if (!config) {
            throw new ServerError('WhitelistRepository.upsertWhitelist at !config')
        }

        try {
            return await whitelistCollection.findOneAndUpdate({email: config?.email},
                {$set: config},
                {upsert: true, new: true, runValidators: true}
            )
        } catch (e) {
            throw new BadRequestError(`Error trying upsert whitelist document, error log ${e}`)
        }
    }

    async findOneByEmail(email: string): Promise<IWhitelist> {
        if (!email) {
            throw new ServerError('WhitelistRepository.findOneByEmail at !email')
        }

        try {
            return await whitelistCollection.findOne({email: email})
        } catch (e) {
            throw new BadRequestError(`Error trying findOneByEmail whitelist document, error log ${e}`)
        }
    }
}