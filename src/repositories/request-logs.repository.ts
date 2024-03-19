import {model, Schema} from "mongoose";
import {ServerError} from "../errors/server-error";
import {BadRequestError} from "../errors/bad-request-error";
import {EnumRequestEvent} from "../types/request/request-event.types";
import {EnumRequestEndpoint} from "../types/request/request-endpoint.types";
import {EnumRequestMethod} from "../types/request/request-method.types";
import {IRequestLogs} from "../types/request-logs.types";

const requestLogsSchema: Schema = new Schema<IRequestLogs>({
    requestUuid: {
        type: String,
        required: [true, 'requestUuid in requestLogsSchema not found'],
        unique: true
    },
    event: {
        type: String,
        enum: Object.values(EnumRequestEvent),
        required: [true, 'event in requestLogsSchema not found'],
    },
    endpoint: {
        type: String,
        enum: Object.values(EnumRequestEndpoint),
        required: [true, 'endpoint in requestLogsSchema not found'],
    },
    requestMethod: {
        type: String,
        enum: Object.values(EnumRequestMethod),
        required: [true, 'endpoint in requestLogsSchema not found'],
    },
    requestStartedAt: {
        type: Date || null,
    },
    requestFinishedAt: {
        type: Date || null,
    },
    requestOrigin: {
        type: String,
        required: [true, 'requestOrigin in requestLogsSchema not found'],
    },
    requestUrl: {
        type: String,
        required: [true, 'requestUrl in requestLogsSchema not found'],
    },
    requestPath: {
        type: String,
        required: [true, 'requestPath in requestLogsSchema not found'],
    },
    requestQuery: {
        type: Object,
        required: [true, 'requestQuery in requestLogsSchema not found'],
    },
    requestBody: {
        type: Object || null,
    },
    requestHeaders: {
        type: Object,
        required: [true, 'requestHeaders in requestLogsSchema not found'],
    },
    responseStatus: {
        type: Number || null,
    },
    isResponseError: {
        type: Boolean
    }
}, {timestamps: true})

const requestLogsCollection = model<IRequestLogs>('requestLogsCollection', requestLogsSchema,  'request-logs')

export class RequestLogsRepository {
    async upsertRequestLogs(config: IRequestLogs): Promise<IRequestLogs> {
        if (!config) {
            throw new ServerError('RequestLogsRepository.upsertRequestLogs at !config')
        }

        try {
            return await requestLogsCollection.findOneAndUpdate({requestUuid: config?.requestUuid},
                {$set: config},
                {upsert: true, new: true, runValidators: true}
            )
        } catch (e) {
            throw new BadRequestError(`Error trying upsert requestLog document, error log ${e}`)
        }
    }
}