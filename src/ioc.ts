import { Container, interfaces } from 'inversify';
import 'reflect-metadata';
import { Auth0OAuth2Gateway } from './gateways/auth0-oauth2';
import { IOAuth2Gateway } from './interfaces/oauth2-gateway';
import { TeamRepository } from './repositories/sequelize/team';
import { UserRepository } from './repositories/sequelize/user';
import { ITeamRepository } from './repositories/team';
import { IUserRepository } from './repositories/user';
import { TeamService } from './services/team';
import { UserService } from './services/user';

const container: Container = new Container();

container.bind<ITeamRepository>('ITeamRepository').to(TeamRepository);
container.bind<IUserRepository>('IUserRepository').to(UserRepository);

container.bind<TeamService>('TeamService').to(TeamService);
container.bind<UserService>('UserService').to(UserService);

container.bind<IOAuth2Gateway>('IOAuth2Gateway').to(Auth0OAuth2Gateway);

export {
    container,
};
