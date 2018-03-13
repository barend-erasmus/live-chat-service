import * as express from 'express';
import { LiveChatError } from '../errors/live-chat-error';
import { OperationResult } from '../models/operation-result';

export class BaseRouter {

    protected static sendError(error: Error, response: express.Response): void {
        console.error(error);
        response.status(500).json(LiveChatError.fromError(error));
    }

    protected static sendOperationResult(response: express.Response, result: OperationResult<any>): void {
        if (result.hasErrors()) {
            response.status(400).json(result.messages);
        } else {
            response.json(result.result);
        }
    }
}
