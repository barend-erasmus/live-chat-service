import { Container, interfaces } from 'inversify';
import 'reflect-metadata';
import { UserRepository } from './repositories/sequelize/user';
import { IUserRepository } from './repositories/user';
import { UserService } from './services/user';
import { ITeamRepository } from './repositories/team';
import { TeamRepository } from './repositories/sequelize/team';

const container: Container = new Container();

container.bind<ITeamRepository>('ITeamRepository').to(TeamRepository);
container.bind<IUserRepository>('IUserRepository').to(UserRepository);

container.bind<UserService>('UserService').to(UserService);

export {
    container,
};
