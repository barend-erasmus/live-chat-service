import * as express from 'express';
import * as request from 'request-promise';
import { IOAuth2Gateway } from '../interfaces/oauth2-gateway';
import { container } from '../ioc';
import { UserService } from '../services/user';
import { LiveChatError } from '../errors/live-chat-error';

export class UserRouter {

    public static async info(req: express.Request, res: express.Response) {
        try {
            const token: string = UserRouter.getAuthorizationToken(req);

            try {
                const userInfo: any = await container.get<IOAuth2Gateway>('IOAuth2Gateway').getUserInfo(req.get('Authorization'));

                res.json(userInfo);
            } catch (err) {
                res.status(401).end();
            }

        } catch (err) {
            res.status(500).json(LiveChatError.fromError(err));
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