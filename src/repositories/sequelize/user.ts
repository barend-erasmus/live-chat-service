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

        user.id = result.id;

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

    public async findById(userId: number): Promise<User> {
        const result: any = await BaseRepository.models.User.find({
            where: {
                id: {
                    [Sequelize.Op.eq]: userId,
                },
            },
        });

        if (!result) {
            return null;
        }

        return this.mapToUser(result);
    }

    public async findByUserName(userName: string): Promise<User> {
        const result: any = await BaseRepository.models.User.find({
            where: {
                emailAddress: {
                    [Sequelize.Op.eq]: userName,
                },
            },
        });

        if (!result) {
            return null;
        }

        return this.mapToUser(result);
    }

    public async list(): Promise<User[]> {
        const result: any[] = await BaseRepository.models.User.findAll({

        });

        return result.map((user) => this.mapToUser(user));
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
