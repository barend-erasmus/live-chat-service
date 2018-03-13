import { inject, injectable } from 'inversify';
import 'reflect-metadata';
import { User } from '../entities/user';
import { OperationResult } from '../models/operation-result';
import { IUserRepository } from '../repositories/user';

@injectable()
export class UserService {

    constructor(
        @inject('IUserRepository')
        private userRepository: IUserRepository,
    ) {
    }

    public async list(query: string): Promise<OperationResult<User[]>> {
        let result: User[] = await this.userRepository.list();

        result = result.filter((user) => user.displayName.indexOf(query) > -1 || user.emailAddress.indexOf(query) > -1);

        return OperationResult.create<User[]>(result);
    }

    public async login(user: User, token: string): Promise<OperationResult<User>> {
        let result: User = await this.userRepository.findByUserName(user.emailAddress);

        result = !result ? await this.userRepository.create(user, token) : await this.userRepository.update(result, token);

        return OperationResult.create<User>(result);
    }

    public async findByToken(token: string): Promise<OperationResult<User>> {
        const result: User = await this.userRepository.find(token);

        return OperationResult.create<User>(result);
    }
}
