import { injectable } from 'inversify';
import 'reflect-metadata';
import * as Sequelize from 'sequelize';
import { User } from '../../entities/user';
import { IUserRepository } from '../user';
import { BaseRepository } from './base';

@injectable()
export class UserRepository extends BaseRepository implements IUserRepository {

    constructor() {
        super();
    }

    public async create(user: User, token: string): Promise<User> {
        const result: any = await BaseRepository.models.User.create({
            displayName: user.displayName,
            emailAddress: user.emailAddress,
            expiryTimestamp: new Date().getTime() + 3600000,
            token,
        });

        return user;
    }

    public async find(token: string): Promise<User> {
        const result: any = await BaseRepository.models.User.find({
            where: {
                expiryTimestamp: {
                    [Sequelize.Op.gte]: new Date().getTime(),
                },
                token: {
                    [Sequelize.Op.eq]: token,
                },
            },
        });

        if (!result) {
            return null;
        }

        return this.mapToUser(result);
    }

    public async findByUserName(userName: string): Promise<User> {
        const result: any[] = await BaseRepository.models.User.findAll({
            limit: 1,
            order: [['expiryTimestamp', 'DESC']],
            where: {
                email: {
                    [Sequelize.Op.eq]: userName,
                },
            },
        });

        if (result.length < 1) {
            return null;
        }

        return this.mapToUser(result[0]);
    }

    public async update(user: User, token: string): Promise<User> {
        const result: any = await BaseRepository.models.User.find({
            where: {
                emailAddress: {
                    [Sequelize.Op.eq]: user.emailAddress,
                },
            },
        });

        result.displayName = user.displayName;

        result.expiryTimestamp = new Date().getTime() + 3600000;
        result.token = token;

        result.save();

        return user;
    }
}
