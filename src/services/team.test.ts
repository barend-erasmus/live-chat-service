import { expect } from 'chai';
import 'mocha';
import * as sinon from 'sinon';

import { Team } from '../entities/team';
import { User } from '../entities/user';
import { TeamOwnerView } from '../entity-views/team-owner';
import { TeamParticipantView } from '../entity-views/team-participant';
import { OperationResult } from '../models/operation-result';
import { ITeamRepository } from '../repositories/team';
import { IUserRepository } from '../repositories/user';
import { TeamService } from './team';

describe('TeamService', () => {

    let teamRepository: ITeamRepository = null;
    let userRepository: IUserRepository = null;

    let teamService: TeamService = null;

    beforeEach(async () => {
        teamRepository = {
            create: async (team: Team) => {
                return team;
            },
            find: async (teamId: number) => {
                return null;
            },
            update: async (team: Team) => {
                return team;
            },
        } as ITeamRepository;

        userRepository = {
            findByUserName: async (userName: string) => {
                return new User('email-address', 'display-name', 1);
            },
        } as IUserRepository;

        teamService = new TeamService(teamRepository, userRepository);
    });

    describe('acceptTeam', () => {

        it('should return with validation message given non existing team', async () => {
            const result: OperationResult<Team> = await teamService.acceptTeam(1, 'email-address');

            expect(result.messages[0].message).to.be.eq('Team does not exist.');
        });

        it('should return with validation message given non existing participant', async () => {
            sinon.stub(teamRepository, 'find').returns(new Team(null, null, null, []));

            const result: OperationResult<Team> = await teamService.acceptTeam(1, 'email-address');

            expect(result.messages[0].message).to.be.eq('You are not a participant of this team.');
        });

        it('should return team', async () => {
            sinon.stub(teamRepository, 'find').returns(new Team(null, null, null, [
                new TeamParticipantView(false, 'email-address', 'display-name', 1),
            ]));

            const result: OperationResult<Team> = await teamService.acceptTeam(1, 'email-address');

            expect(result.result).to.be.not.null;
        });

        it('should set accepted to true', async () => {
            sinon.stub(teamRepository, 'find').returns(new Team(null, null, null, [
                new TeamParticipantView(false, 'email-address', 'display-name', 1),
            ]));

            const teamRepositoryUpdate: sinon.SinonSpy = sinon.spy(teamRepository, 'update');

            await teamService.acceptTeam(1, 'email-address');

            expect(teamRepositoryUpdate.args[0][0].participants[0].accepted).to.be.true;
        });

    });

    describe('create', () => {

        it('should return team', async () => {
            const result: OperationResult<Team> = await teamService.create(new Team(null, null, null, null), 'email-address');

            expect(result.result).to.be.not.null;
        });

        it('should set owner', async () => {
            const teamRepositoryCreate: sinon.SinonSpy = sinon.spy(teamRepository, 'create');

            await teamService.create(new Team(null, null, null, null), 'email-address');

            expect(teamRepositoryCreate.args[0][0].owner).to.be.not.null;
        });

        it('should add owner to participant', async () => {
            const teamRepositoryCreate: sinon.SinonSpy = sinon.spy(teamRepository, 'create');

            await teamService.create(new Team(null, null, null, null), 'email-address');

            expect(teamRepositoryCreate.args[0][0].participants.find((participant) => participant.emailAddress === 'email-address')).to.be.not.null;
        });

        it('should set all participants accepted to false', async () => {
            const teamRepositoryCreate: sinon.SinonSpy = sinon.spy(teamRepository, 'create');

            await teamService.create(new Team(null, null, null, null), 'email-address');

            expect(teamRepositoryCreate.args[0][0].participants.filter((participant) => participant.accepted).length).to.be.eq(0);
        });

    });

    describe('update', () => {

        it('should return with validation message given non existing team', async () => {
            const result: OperationResult<Team> = await teamService.update(new Team(null, null, null, null), 'email-address');

            expect(result.messages[0].message).to.be.eq('Team does not exist.');
        });

        it('should return team', async () => {
            sinon.stub(teamRepository, 'find').returns(new Team(null, null, new TeamOwnerView(null, null, 1), null));

            const result: OperationResult<Team> = await teamService.update(new Team(null, null, new TeamOwnerView(null, null, 1), null), 'email-address');

            expect(result.result).to.be.not.null;
        });

        it('should throw error given incorrect owner', async () => {
            sinon.stub(teamRepository, 'find').returns(new Team(null, null, new TeamOwnerView(null, null, 2), null));

            const result: OperationResult<Team> = await teamService.update(new Team(null, null, new TeamOwnerView(null, null, 2), null), 'email-address');

            expect(result.messages[0].message).to.be.eq('You are not the owner of this team.');
        });

        it('should remove removed participants', async () => {
            sinon.stub(teamRepository, 'find').returns(new Team(null, null, new TeamOwnerView(null, null, 1), [
                new TeamParticipantView(false, null, null, 1),
                new TeamParticipantView(false, null, null, 2),
                new TeamParticipantView(false, null, null, 3),
            ]));

            const teamRepositoryUpdate: sinon.SinonSpy = sinon.spy(teamRepository, 'update');

            await teamService.update(new Team(null, null, new TeamOwnerView(null, null, 1), [
                new TeamParticipantView(false, null, null, 1),
                new TeamParticipantView(false, null, null, 3),
            ]), 'email-address');

            expect(teamRepositoryUpdate.args[0][0].participants.length).to.be.eq(2);
        });

        it('should add added participants', async () => {
            sinon.stub(teamRepository, 'find').returns(new Team(null, null, new TeamOwnerView(null, null, 1), [
                new TeamParticipantView(false, null, null, 1),
                new TeamParticipantView(false, null, null, 2),
                new TeamParticipantView(false, null, null, 3),
            ]));

            const teamRepositoryUpdate: sinon.SinonSpy = sinon.spy(teamRepository, 'update');

            await teamService.update(new Team(null, null, new TeamOwnerView(null, null, 1), [
                new TeamParticipantView(false, null, null, 1),
                new TeamParticipantView(false, null, null, 2),
                new TeamParticipantView(false, null, null, 3),
                new TeamParticipantView(false, null, null, 4),
            ]), 'email-address');

            expect(teamRepositoryUpdate.args[0][0].participants.length).to.be.eq(4);
        });

        it('should add added participants with accepted to false', async () => {
            sinon.stub(teamRepository, 'find').returns(new Team(null, null, new TeamOwnerView(null, null, 1), [
                new TeamParticipantView(false, null, null, 1),
                new TeamParticipantView(false, null, null, 2),
                new TeamParticipantView(false, null, null, 3),
            ]));

            const teamRepositoryUpdate: sinon.SinonSpy = sinon.spy(teamRepository, 'update');

            await teamService.update(new Team(null, null, new TeamOwnerView(null, null, 1), [
                new TeamParticipantView(false, null, null, 1),
                new TeamParticipantView(false, null, null, 2),
                new TeamParticipantView(false, null, null, 3),
                new TeamParticipantView(true, null, null, 4),
            ]), 'email-address');

            expect(teamRepositoryUpdate.args[0][0].participants[3].accepted).to.be.false;
        });

    });
});
