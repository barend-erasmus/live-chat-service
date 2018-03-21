import * as express from 'express';

import { Application } from '../entities/application';
import { LiveChatError } from '../errors/live-chat-error';
import { container } from '../ioc';
import { OperationResult } from '../models/operation-result';
import { ApplicationService } from '../services/application';
import { BaseRouter } from './base';

export class ApplicationRouter extends BaseRouter {

    public static async get(req: express.Request, res: express.Response) {
        try {
            if (req.query.applicationId) {
                const result: OperationResult<Application> = await container.get<ApplicationService>('ApplicationService').find(req.query.applicationId, req['user']['emailAddress']);

                ApplicationRouter.sendOperationResult(res, result);
            } else {
                const result: OperationResult<Application[]> = await container.get<ApplicationService>('ApplicationService').list(req.query.teamId, req['user']['emailAddress']);

                ApplicationRouter.sendOperationResult(res, result);
            }
        } catch (err) {
            res.status(500).json(LiveChatError.fromError(err));
        }
    }

    public static async post(req: express.Request, res: express.Response) {
        try {
            const result: OperationResult<Application> = await container.get<ApplicationService>('ApplicationService').create(req.body, req['user']['emailAddress']);

            ApplicationRouter.sendOperationResult(res, result);
        } catch (err) {
            res.status(500).json(LiveChatError.fromError(err));
        }
    }

    public static async put(req: express.Request, res: express.Response) {
        try {
            const result: OperationResult<Application> = await container.get<ApplicationService>('ApplicationService').update(req.body, req['user']['emailAddress']);

            ApplicationRouter.sendOperationResult(res, result);
        } catch (err) {
            res.status(500).json(LiveChatError.fromError(err));
        }
    }
}
