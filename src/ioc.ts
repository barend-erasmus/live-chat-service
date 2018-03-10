import { Container, interfaces } from 'inversify';
import 'reflect-metadata';
import { UserRepository } from './repositories/sequelize/user';
import { IUserRepository } from './repositories/user';
import { UserService } from './services/user';

const container: Container = new Container();

container.bind<IUserRepository>('IUserRepository').to(UserRepository);

container.bind<UserService>('UserService').to(UserService);

export {
    container,
};
