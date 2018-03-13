import * as express from 'express';
import * as request from 'request-promise';
import * as yargs from 'yargs';
import { User } from '../entities/user';
import { LiveChatError } from '../errors/live-chat-error';
import { container } from '../ioc';
import { OperationResult } from '../models/operation-result';
import { UserService } from '../services/user';

export class AuthenticationMiddleware {

    public static async shouldBeAuthenticated(req: express.Request, res: express.Response, next: express.NextFunction): Promise<void> {
        try {
            const argv = yargs.argv;

            const result: OperationResult<User> = await container.get<UserService>('UserService').findByToken(AuthenticationMiddleware.getAuthorizationToken(req));

            if (result.result) {
                req['user'] = result.result;
                next();
                return;
            }

            const authenticationResponse: any = await request({
                headers: {
                    Authorization: req.get('Authorization'),
                },
                json: true,
                uri: `${argv.prod ? 'https://api.chat.developersworkpsace.co.za' : 'http://localhost:3000'}/api/user/info`,
            });

            req['user'] = authenticationResponse;

            next();

        } catch (err) {
            console.log(`${req.url} - 401`);
            res.status(401).end();
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
