import { inject, injectable } from 'inversify';
import 'reflect-metadata';
import { Team } from '../entities/team';
import { TeamOwner } from '../entities/team-owner';
import { TeamParticipant } from '../entities/team-participant';
import { User } from '../entities/user';
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

    public async acceptTeam(teamId: number, userName: string): Promise<Team> {
        const user: User = await this.userRepository.findByUserName(userName);

        let team: Team = await this.teamRepository.find(teamId);

        if (!team) {
            throw new LiveChatError('not_found', 'Team does not exist.');
        }

        const teamParticipant: TeamParticipant = team.participants.find((participant) => participant.id === user.id);

        if (!teamParticipant) {
            throw new LiveChatError('not_found', 'You are not a participant of this team.');
        }

        team = await this.teamRepository.update(team);

        return team;
    }

    public async create(team: Team, userName: string): Promise<Team> {
        team.owner = await this.userRepository.findByUserName(userName);

        team.participants = team.participants ? team.participants : [];

        if (!team.participants.find((x) => x.id === team.owner.id)) {
            team.participants.push(new TeamParticipant(true, team.owner.emailAddress, team.owner.displayName, team.owner.id));
        }

        for (const participant of team.participants) {
            participant.accepted = false;
        }

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
        const user: User = await this.userRepository.findByUserName(userName);

        const existingTeam: Team = await this.teamRepository.find(team.id);

        if (!existingTeam) {
            throw new LiveChatError('not_found', 'Team does not exist.');
        }

        if (existingTeam.owner.id !== user.id) {
            throw new LiveChatError('unauthorized', 'You are not the owner of this team.');
        }

        existingTeam.name = team.name;

        const participantsUpdateResult = ArrayHelper.updateArray<TeamParticipant>(existingTeam.participants, team.participants, (item: TeamParticipant) => item.id);

        for (const participant of participantsUpdateResult.itemsToRemove) {
            const index: number = existingTeam.participants.indexOf(participant);
            existingTeam.participants.splice(index, 1);
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
