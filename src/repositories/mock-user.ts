import { injectable } from 'inversify';
import 'reflect-metadata';
import { User } from '../entities/user';
import { IUserRepository } from './user';

@injectable()
export class MockUserRepsoitory implements IUserRepository {

    public async findByUserName(userName: string): Promise<User> {
        return new User('hello@world.com', 'Hello World');
    }
}
