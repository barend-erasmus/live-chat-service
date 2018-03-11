import { Container, interfaces } from 'inversify';
import 'reflect-metadata';
import { TeamRepository } from './repositories/sequelize/team';
import { UserRepository } from './repositories/sequelize/user';
import { ITeamRepository } from './repositories/team';
import { IUserRepository } from './repositories/user';
import { UserService } from './services/user';
import { TeamService } from './services/team';

const container: Container = new Container();

container.bind<ITeamRepository>('ITeamRepository').to(TeamRepository);
container.bind<IUserRepository>('IUserRepository').to(UserRepository);

container.bind<TeamService>('TeamService').to(TeamService);
container.bind<UserService>('UserService').to(UserService);

export {
    container,
};
