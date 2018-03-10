import { inject, injectable } from 'inversify';
import 'reflect-metadata';
import { Team } from '../entities/team';
import { TeamOwner } from '../entities/team-owner';
import { LiveChatError } from '../errors/live-chat-error';
import { ITeamRepository } from '../repositories/team';
import { IUserRepository } from '../repositories/user';

@injectable()
export class TeamService {

    constructor(
        @inject('ITeamRepository')
        private teamRepository: ITeamRepository,
        @inject('IUserRepository')
        private userRepository: IUserRepository,
    ) {
    }

    public async create(team: Team, userName: string): Promise<Team> {
        team.owner = await this.userRepository.findByUserName(userName);

        team = await this.teamRepository.create(team);

        return team;
    }

    public async find(teamId: number, userName: string): Promise<Team> {
        const team: Team = await this.teamRepository.find(teamId);

        return team;
    }

    public async update(team: Team, userName: string): Promise<Team> {
        const exisitingTeam: Team = await this.teamRepository.find(team.id);

        if (exisitingTeam.owner.emailAddress !== userName) {
            throw new LiveChatError('unauthorized', 'You are not the owner of this team.');
        }

        team = await this.teamRepository.update(team);

        return team;
    }
}
