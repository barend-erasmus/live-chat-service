import { inject, injectable } from 'inversify';
import 'reflect-metadata';
import { Team } from '../entities/team';
import { TeamOwner } from '../entities/team-owner';
import { TeamParticipant } from '../entities/team-participant';
import { LiveChatError } from '../errors/live-chat-error';
import { ArrayHelper } from '../helpers/array-helper';
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

        team.participants = team.participants ? team.participants : [];

        team.participants.push(new TeamParticipant(true, team.owner.emailAddress, team.owner.displayName, team.owner.id));

        team = await this.teamRepository.create(team);

        return team;
    }

    public async find(teamId: number, userName: string): Promise<Team> {
        const team: Team = await this.teamRepository.find(teamId);

        return team;
    }

    public async list(userName: string): Promise<Team[]> {
        const teams: Team[] = await this.teamRepository.list(userName);

        return teams;
    }

    public async update(team: Team, userName: string): Promise<Team> {
        const existingTeam: Team = await this.teamRepository.find(team.id);

        if (!existingTeam) {
            throw new LiveChatError('not_found', 'Team does not exist.');
        }

        if (existingTeam.owner.emailAddress !== userName) {
            throw new LiveChatError('unauthorized', 'You are not the owner of this team.');
        }

        existingTeam.name = team.name;

        const participantsUpdateResult = ArrayHelper.updateArray<TeamParticipant>(existingTeam.participants, team.participants, (item: TeamParticipant) => item.id);

        for (const participant of participantsUpdateResult.itemsToRemove) {
            const index: number = existingTeam.participants.indexOf(participant);
            existingTeam.participants = existingTeam.participants.splice(index, 1);
        }

        for (const participant of participantsUpdateResult.itemsToAdd) {
            participant.accepted = false;
            existingTeam.participants.push(participant);
        }

        for (const participant of participantsUpdateResult.itemsToUpdate) {

        }

        team = await this.teamRepository.update(existingTeam);

        return team;
    }
}
