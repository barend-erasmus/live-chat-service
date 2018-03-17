import { injectable } from 'inversify';
import 'reflect-metadata';
import * as Sequelize from 'sequelize';

import { Application } from '../../entities/application';
import { IApplicationRepository } from '../application';
import { BaseRepository } from './base';

@injectable()
export class ApplicationRepository extends BaseRepository implements IApplicationRepository {

    constructor() {
        super();
    }

    public async create(application: Application): Promise<Application> {
        const result: any = await BaseRepository.models.Application.create({
            name: application.name,
            teamId: application.team.id,
        });

        return this.find(result.id);
    }

    public async find(applicationId: number): Promise<Application> {
        const result: any = await BaseRepository.models.Application.find({
            include: [
                {
                    include: [
                        {
                            include: [
                                {
                                    model: BaseRepository.models.Team,
                                },
                                {
                                    model: BaseRepository.models.User,
                                },
                            ],
                            model: BaseRepository.models.TeamParticipant,
                        },
                        {
                            as: 'teamOwner',
                            model: BaseRepository.models.User,
                        },
                    ],
                    model: BaseRepository.models.Team,
                },
            ],
            where: {
                id: {
                    [Sequelize.Op.eq]: applicationId,
                },
            },
        });

        if (!result) {
            return null;
        }

        return this.mapToApplication(result);
    }

    public async list(teamId: number): Promise<Application[]> {
        const result: any[] = await BaseRepository.models.Application.findAll({
            include: [
                {
                    include: [
                        {
                            include: [
                                {
                                    model: BaseRepository.models.Team,
                                },
                                {
                                    model: BaseRepository.models.User,
                                },
                            ],
                            model: BaseRepository.models.TeamParticipant,
                        },
                        {
                            as: 'teamOwner',
                            model: BaseRepository.models.User,
                        },
                    ],
                    model: BaseRepository.models.Team,
                },
            ],
            where: {
                teamId: {
                    [Sequelize.Op.eq]: teamId,
                },
            },
        });

        return result.map((team) => this.mapToApplication(team));
    }

    public async update(application: Application): Promise<Application> {
        const result: any = await BaseRepository.models.Application.find({
            include: [
                {
                    include: [
                        {
                            include: [
                                {
                                    model: BaseRepository.models.Team,
                                },
                                {
                                    model: BaseRepository.models.User,
                                },
                            ],
                            model: BaseRepository.models.TeamParticipant,
                        },
                        {
                            as: 'teamOwner',
                            model: BaseRepository.models.User,
                        },
                    ],
                    model: BaseRepository.models.Team,
                },
            ],
            where: {
                id: {
                    [Sequelize.Op.eq]: application.id,
                },
            },
        });

        result.name = application.name;

        await result.save();

        return this.find(application.id);
    }
}
