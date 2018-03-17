import * as express from 'express';

import { User } from '../entities/user';
import { LiveChatError } from '../errors/live-chat-error';
import { IOAuth2Gateway } from '../interfaces/oauth2-gateway';
import { container } from '../ioc';
import { OperationResult } from '../models/operation-result';
import { UserService } from '../services/user';
import { BaseRouter } from './base';

export class UserRouter extends BaseRouter {

    public static async get(req: express.Request, res: express.Response) {
        try {
            const result: OperationResult<User[]> = await container.get<UserService>('UserService').list(req.query.query);

            UserRouter.sendOperationResult(res, result);
        } catch (err) {
            UserRouter.sendError(err, res);
        }
    }

    public static async info(req: express.Request, res: express.Response) {
        try {
            const token: string = UserRouter.getAuthorizationToken(req);

            const userInfo: any = await container.get<IOAuth2Gateway>('IOAuth2Gateway').getUserInfo(req.get('Authorization'));

            const result: OperationResult<User> = await container.get<UserService>('UserService').login(new User(
                userInfo.email,
                userInfo.name,
                null,
            ), token);

            UserRouter.sendOperationResult(res, result);

        } catch (err) {
            UserRouter.sendError(err, res);
        }
    }

    private static getAuthorizationToken(req: express.Request): string {
        const authorizationHeader: string = req.get('Authorization');

        if (!authorizationHeader) {
            throw new LiveChatError('invalid_token', 'Invalid token');
        }

        const splittedAuthorizationHeader: string[] = authorizationHeader.split(' ');

        if (splittedAuthorizationHeader.length !== 2 && splittedAuthorizationHeader[0].toLowerCase() === 'bearer') {
            throw new LiveChatError('invalid_token', 'Invalid token');
        }

        return splittedAuthorizationHeader[1];
    }
}
