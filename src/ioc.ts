import { Container, interfaces } from 'inversify';
import 'reflect-metadata';
import { MockUserRepsoitory } from './repositories/mock-user';
import { IUserRepository } from './repositories/user';
import { UserService } from './services/user';

const container: Container = new Container();

container.bind<IUserRepository>('IUserRepository').to(MockUserRepsoitory);

container.bind<UserService>('UserService').to(UserService);

export {
    container,
};
