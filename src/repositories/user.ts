import { User } from '../entities/user';

export interface IUserRepository {
    findByUserName(userName: string): Promise<User>;
}
