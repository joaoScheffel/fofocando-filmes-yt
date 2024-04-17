import {model, Schema} from "mongoose"
import {IWhitelist} from "../../domain/interfaces/whitelist.interface"
import {EnumUserPermission} from "../../domain/enums/user-permission.enum"
import {ServerError} from "../../domain/errors/server-error"
import {BadRequestError} from "../../domain/errors/bad-request-error"

export const whitelistSchema: Schema = new Schema<IWhitelist>({
    email: {
        type: String,
        required: [true, 'email in whitelistSchema not found']
    },
    allowedPermissions: {
        type: [String],
        enum: Object.values(EnumUserPermission),
        required: [true, 'allowedPermissions in whitelistSchema not found']
    },
    defaultPermission: {
        type: String,
        enum: Object.values(EnumUserPermission),
        required: [true, 'defaultPermission in whitelistSchema not found']
    },
    isBanned: {
        type: Boolean,
        default: false,
        required: [true, 'isBanned in whitelistSchema not found']
    }
}, {timestamps: true})

const whitelistCollection = model<IWhitelist>('whitelist', whitelistSchema,  'whitelist')

export class WhitelistRepository {
    async upsertWhitelist(config: IWhitelist): Promise<IWhitelist> {
        if (!config) {
            throw new ServerError('WhitelistRepository.upsertWhitelist at !config', 'validate fields before upsert')
        }

        try {
            return await whitelistCollection.findOneAndUpdate({email: config?.email},
                {$set: config},
                {upsert: true, new: true, runValidators: true}
            )
        } catch (e) {
            throw new BadRequestError(`WhitelistRepository.upsertWhitelist at catch`, 'Error trying upsert whitelist document', false, e)
        }
    }

    async findOneByEmail(email: string): Promise<IWhitelist> {
        if (!email) {
            throw new ServerError('WhitelistRepository.findOneByEmail at !email', 'validate fields before findOneByEmail')
        }

        try {
            return await whitelistCollection.findOne({email: email})
        } catch (e) {
            throw new BadRequestError(`WhitelistRepository.findOneByEmail at catch`, 'Error trying findOneByEmail whitelist document', false, e)
        }
    }

    async findBannedEmail(email: string, isBanned: boolean) {
        if (!email) {
            throw new ServerError('WhitelistRepository.findBannedEmail at !email', 'validate fields before findBannedEmail')
        }

        try {
            return await whitelistCollection.findOne({email: email, isBanned: isBanned})
        } catch (e) {
            throw new BadRequestError(`WhitelistRepository.findBannedEmail at catch`, 'Error trying findBannedEmail whitelist document', false, e)
        }
    }
}