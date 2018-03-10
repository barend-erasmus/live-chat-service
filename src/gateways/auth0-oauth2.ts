import { injectable } from 'inversify';
import 'reflect-metadata';
import * as request from 'request-promise';
import { IOAuth2Gateway } from '../interfaces/oauth2-gateway';

@injectable()
export class Auth0OAuth2Gateway implements IOAuth2Gateway {

    public async getUserInfo(authorizationHeader: string): Promise<any> {
        const response: any = await request({
            headers: {
                Authorization: authorizationHeader,
            },
            json: true,
            uri: 'https://worldofrations.auth0.com/userinfo',
        });

        return response;
    }
}
