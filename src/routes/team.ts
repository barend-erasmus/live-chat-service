import * as express from 'express';
import * as request from 'request-promise';
import { Team } from '../entities/team';
import { LiveChatError } from '../errors/live-chat-error';
import { container } from '../ioc';
import { OperationResult } from '../models/operation-result';
import { TeamService } from '../services/team';
import { BaseRouter } from './base';

export class TeamRouter extends BaseRouter {

    public static async get(req: express.Request, res: express.Response) {
        try {
            if (req.query.teamId) {
                const result: OperationResult<Team> = await container.get<TeamService>('TeamService').find(req.query.teamId, req['user']['emailAddress']);

                this.sendOperationResult(res, result);
            } else {
                const result: OperationResult<Team[]> = await container.get<TeamService>('TeamService').list(req['user']['emailAddress']);

                this.sendOperationResult(res, result);
            }
        } catch (err) {
            res.status(500).json(LiveChatError.fromError(err));
        }
    }

    public static async post(req: express.Request, res: express.Response) {
        try {
            const result: OperationResult<Team> = await container.get<TeamService>('TeamService').create(req.body, req['user']['emailAddress']);

            this.sendOperationResult(res, result);
        } catch (err) {
            res.status(500).json(LiveChatError.fromError(err));
        }
    }
}
