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

    public async list(): Promise<User[]> {
        const result: User[] = await this.userRepository.list();

        return result;
    }

    public async login(user: User, token: string): Promise<User> {
        let result: User = await this.userRepository.findByUserName(user.emailAddress);

        result = !result ? await this.userRepository.create(user, token) : await this.userRepository.update(result, token);

        return result;
    }

    public async findByToken(token: string): Promise<User> {
        const result: User = await this.userRepository.find(token);

        return result;
    }
}
