import { injectable } from 'inversify';
import 'reflect-metadata';
import * as Sequelize from 'sequelize';
import { Team } from '../../entities/team';
import { ITeamRepository } from '../team';
import { BaseRepository } from './base';

@injectable()
export class TeamRepository extends BaseRepository implements ITeamRepository {

    constructor() {
        super();
    }

    public async create(team: Team): Promise<Team> {
        const result: any = await BaseRepository.models.Team.create({
            name: team.name,
            teamOwnerId: team.owner.id,
            teamParticipants: team.participants.map((participant) => {
                return {
                    userId: participant.id,
                };
            }),
        });

        team.id = result.id;

        return team;
    }

    public async find(teamId: number): Promise<Team> {
        const result: any = await BaseRepository.models.Team.find({
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
            where: {
                id: teamId,
            },
        });

        if (!result) {
            return null;
        }

        return this.mapToTeam(result);
    }

    public update(team: Team): Promise<Team> {
        throw new Error('Method not implemented.');
    }
}
