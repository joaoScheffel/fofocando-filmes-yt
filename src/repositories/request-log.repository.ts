import {model, Schema} from "mongoose";
import {ServerError} from "../errors/server-error";
import {BadRequestError} from "../errors/bad-request-error";
import {IRequestLog} from "../types/request/request-log.types";
import {EnumRequestEvent} from "../types/request/request-event.types";
import {EnumRequestEndpoint} from "../types/request/request-endpoint.types";
import {EnumRequestMethod} from "../types/request/request-method.types";

const requestLogSchema: Schema = new Schema<IRequestLog>({
    requestUuid: {
        type: String,
        required: [true, 'requestUuid in requestLogSchema not found'],
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
        type: Date,
        required: [true, 'requestStartedAt in requestLogsSchema not found'],
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
    requestHeaders: {
        type: Object,
        required: [true, 'requestHeaders in requestLogsSchema not found'],
    },
    requestBody: {
        type: Object,
    },
    requestFinishedAt: {
        type: Date,
    },
    responseStatus: {
        type: Number,
    },
    isResponseError: {
        type: Boolean
    }
}, {timestamps: true})

const requestLogCollection = model<IRequestLog>('requestLogCollection', requestLogSchema,  'requestLogs')

export class RequestLogRepository {
    async upsertRequestLog(config: IRequestLog) {
        if (!config) {
            throw new ServerError('RequestLogRepository.upsertRequestLog at !config')
        }

        try {
           return await requestLogCollection.findOneAndUpdate({requestUuid: config?.requestUuid},
               {$set: config},
               {upsert: true, new: true, runValidators: true}
           )
       } catch (e) {
            throw new BadRequestError(`Error trying upsert requestLog document, error log ${e}`)
       }
    }
}