import * as express from 'express';
import * as request from 'request-promise';
import { Team } from '../entities/team';
import { LiveChatError } from '../errors/live-chat-error';
import { container } from '../ioc';
import { TeamService } from '../services/team';

export class TeamRouter {

    public static async get(req: express.Request, res: express.Response) {
        try {
            if (req.query.teamId) {
                const result: Team = await container.get<TeamService>('TeamService').find(req.query.teamId, req['user']['emailAddress']);

                res.json(result);
            } else {
                const result: Team[] = await container.get<TeamService>('TeamService').list(req['user']['emailAddress']);

                res.json(result);
            }
        } catch (err) {
            res.status(500).json(LiveChatError.fromError(err));
        }
    }

    public static async post(req: express.Request, res: express.Response) {
        try {
            const result: Team = await container.get<TeamService>('TeamService').create(req.body, req['user']['emailAddress']);

            res.json(result);
        } catch (err) {
            res.status(500).json(LiveChatError.fromError(err));
        }
    }
}
