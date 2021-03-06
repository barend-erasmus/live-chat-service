import { inject, injectable } from 'inversify';
import 'reflect-metadata';

import { Team } from '../entities/team';
import { User } from '../entities/user';
import { TeamOwnerView } from '../entity-views/team-owner';
import { TeamParticipantView } from '../entity-views/team-participant';
import { ArrayHelper } from '../helpers/array-helper';
import { OperationResult } from '../models/operation-result';
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

    public async acceptTeam(teamId: number, userName: string): Promise<OperationResult<Team>> {
        const result: OperationResult<Team> = OperationResult.create<Team>(null);

        const user: User = await this.userRepository.findByUserName(userName);

        let team: Team = await this.teamRepository.find(teamId);

        if (!team) {
            result.addMessage('not_found', null, 'Team does not exist.');
            return result;
        }

        const teamParticipant: TeamParticipantView = team.participants.find((participant) => participant.id === user.id);

        if (!teamParticipant) {
            result.addMessage('not_found', null, 'You are not a participant of this team.');
            return result;
        }

        teamParticipant.accepted = true;

        team = await this.teamRepository.update(team);

        result.setResult(team);

        return result;
    }

    public async create(team: Team, userName: string): Promise<OperationResult<Team>> {
        const result: OperationResult<Team> = OperationResult.create<Team>(null);

        await this.validateTeam(result, team);

        if (result.hasErrors()) {
            return result;
        }

        const user: User = await this.userRepository.findByUserName(userName);

        if (team.owner.id !== user.id) {
            result.addMessage('unauthorized', null, 'Cannot create a team for another user.');
            return result;
        }

        team.participants = team.participants ? team.participants : [];

        if (!team.participants.find((x) => x.id === team.owner.id)) {
            team.participants.push(new TeamParticipantView(true, team.owner.emailAddress, team.owner.displayName, team.owner.id));
        }

        for (const participant of team.participants) {
            participant.accepted = false;
        }

        team = await this.teamRepository.create(team);

        result.setResult(team);

        return result;
    }

    public async find(teamId: number, userName: string): Promise<OperationResult<Team>> {
        const team: Team = await this.teamRepository.find(teamId);

        return OperationResult.create<Team>(team);
    }

    public async list(userName: string): Promise<OperationResult<Team[]>> {
        const teams: Team[] = await this.teamRepository.list(userName);

        return OperationResult.create<Team[]>(teams);
    }

    public async update(team: Team, userName: string): Promise<OperationResult<Team>> {
        const result: OperationResult<Team> = OperationResult.create<Team>(null);

        await this.validateTeam(result, team);

        if (result.hasErrors()) {
            return result;
        }

        const user: User = await this.userRepository.findByUserName(userName);

        const existingTeam: Team = await this.teamRepository.find(team.id);

        if (!existingTeam) {
            result.addMessage('not_found', null, 'Team does not exist.');
            return result;
        }

        if (existingTeam.owner.id !== user.id) {
            result.addMessage('unauthorized', null, 'You are not the owner of this team.');
            return result;
        }

        existingTeam.name = team.name;
        existingTeam.owner = team.owner;

        const participantsUpdateResult = ArrayHelper.updateArray<TeamParticipantView>(existingTeam.participants, team.participants, (item: TeamParticipantView) => item.id);

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

        result.setResult(team);

        return result;
    }

    private async validateTeam(result: OperationResult<Team>, team: Team): Promise<void> {
        if (!team.owner) {
            result.addMessage('validation', null, 'Team requires an owner.');
            return;
        }

        const owner: User = await this.userRepository.findById(team.owner.id);

        if (!owner) {
            result.addMessage('not_found', null, 'Owner does not exist.');
            return;
        }

        if (team.participants) {
            for (const participant of team.participants) {
                const user: User = await this.userRepository.findById(participant.id);

                if (!user) {
                    result.addMessage('not_found', null, 'Participant does not exist.');
                    continue;
                }
            }
        }

        if (!team.name) {
            result.addMessage('validation', null, 'Team requires a name.');
            return;
        }
    }
}
