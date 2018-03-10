import * as express from 'express';
import * as request from 'request-promise';
import * as yargs from 'yargs';

export class AuthenticationMiddleware {

    public static async shouldBeAuthenticated(req: express.Request, res: express.Response, next: express.NextFunction): Promise<void> {
        try {
            const argv = yargs.argv;

            const result: any = await request({
                headers: {
                    Authorization: req.get('Authorization'),
                },
                json: true,
                uri: `${argv.prod ? 'https://api.live-chat.worldofrations.com' : 'http://localhost:3000'}/api/user/info`,
            });

            req['user'] = result;

            next();

        } catch (err) {
            console.log(`${req.url} - 401`);
            res.status(401).end();
        }
    }
}
