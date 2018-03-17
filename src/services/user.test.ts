import { expect } from 'chai';
import 'mocha';
import * as sinon from 'sinon';

import { User } from '../entities/user';
import { container } from '../ioc';
import { OperationResult } from '../models/operation-result';
import { IUserRepository } from '../repositories/user';
import { UserService } from './user';

describe('UserService', () => {

    let userRepository: IUserRepository = null;

    let userService: UserService = null;

    beforeEach(async () => {
        userRepository = {
            create: async (user: User, token: string) => {
                return user;
            },
            findByUserName: async (userName: string) => {
                return new User('email-address', 'display-name', 1);
            },
            update: async (user: User, token: string) => {
                return user;
            },
        } as IUserRepository;

        userService = new UserService(userRepository);
    });

    describe('login', () => {

        it('should return user', async () => {
            const result: OperationResult<User> = await userService.login(new User('email-address', 'display-name', 1), 'token');

            expect(result.result).to.be.not.null;
        });

        it('should call repository.create given user does not exist', async () => {
            const userRepositoryCreate: sinon.SinonSpy = sinon.spy(userRepository, 'create');

            sinon.stub(userRepository, 'findByUserName').returns(null);

            await userService.login(new User('email-address', 'display-name', 1), 'token');

            expect(userRepositoryCreate.calledOnce).to.be.true;
        });

        it('should call repository.update given user does exist', async () => {
            const userRepositoryUpdate: sinon.SinonSpy = sinon.spy(userRepository, 'update');

            await userService.login(new User('email-address', 'display-name', 1), 'token');

            expect(userRepositoryUpdate.calledOnce).to.be.true;
        });

    });

});
