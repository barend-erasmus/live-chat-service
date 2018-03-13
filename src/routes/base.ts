import * as express from 'express';
import { OperationResult } from '../models/operation-result';

export class BaseRouter {

    protected static sendOperationResult(response: express.Response, result: OperationResult<any>): void {
        if (result.hasErrors()) {
            response.status(400).json(result.messages);
        } else {
            response.json(result.result);
        }
    }
}
