import { inject, injectable } from 'inversify';
import 'reflect-metadata';
import { User } from '../entities/user';
import { IUserRepository } from '../repositories/user';

@injectable()
export class UserService {

    constructor(
        @inject('IUserRepository')
        private userRepository: IUserRepository,
    ) {
    }

    public async find(userName: string): Promise<User> {
        const user: User = await this.userRepository.findByUserName(userName);

        return user;
    }
}
