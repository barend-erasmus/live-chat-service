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

    public async list(teamId: number, userName: string): Promise<Application[]> {
        const result: any[] = await BaseRepository.models.Team.findAll({
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

    // public async update(team: Team): Promise<Team> {
    //     const result: any = await BaseRepository.models.Team.find({
    //         include: [
    //             {
    //                 include: [
    //                     {
    //                         model: BaseRepository.models.Team,
    //                     },
    //                     {
    //                         model: BaseRepository.models.User,
    //                     },
    //                 ],
    //                 model: BaseRepository.models.TeamParticipant,
    //             },
    //             {
    //                 as: 'teamOwner',
    //                 model: BaseRepository.models.User,
    //             },
    //         ],
    //         where: {
    //             id: {
    //                 [Sequelize.Op.eq]: team.id,
    //             },
    //         },
    //     });

    //     result.name = team.name;

    //     const participantsUpdateResult = ArrayHelper.updateArray<any>(result.teamParticipants, team.participants, (item: any) => item.id);

    //     for (const participant of participantsUpdateResult.itemsToRemove) {
    //         await participant.destroy();
    //     }

    //     for (const participant of participantsUpdateResult.itemsToAdd) {
    //         await BaseRepository.models.TeamParticipant.create({
    //             accepted: participant.accepted,
    //             teamId: team.id,
    //             userId: participant.id,
    //         });
    //     }

    //     for (const participant of participantsUpdateResult.itemsToUpdate) {
    //         const teamParticipant: any = await BaseRepository.models.TeamParticipant.find({
    //             where: {
    //                 teamId: {
    //                     [Sequelize.Op.eq]: team.id,
    //                 },
    //                 userId: {
    //                     [Sequelize.Op.eq]: participant.id,
    //                 },
    //             },
    //         });

    //         teamParticipant.accepted = participant.accepted;

    //         await teamParticipant.save();
    //     }

    //     await result.save();

    //     return this.find(team.id);
    // }
}
