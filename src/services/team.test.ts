import { expect } from 'chai';
import { create } from 'domain';
import 'mocha';
import * as sinon from 'sinon';
import { Team } from '../entities/team';
import { TeamOwner } from '../entities/team-owner';
import { TeamParticipant } from '../entities/team-participant';
import { User } from '../entities/user';
import { container } from '../ioc';
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

    describe('create', () => {

        it('should return team', async () => {
            const result: Team = await teamService.create(new Team(null, null, null, null), 'email-address');

            expect(result).to.be.not.null;
        });

        it('should set owner', async () => {
            const teamRepositoryCreate: sinon.SinonSpy = sinon.spy(teamRepository, 'create');

            const result: Team = await teamService.create(new Team(null, null, null, null), 'email-address');

            expect(teamRepositoryCreate.args[0][0].owner).to.be.not.null;
        });

        it('should add owner to participant', async () => {
            const teamRepositoryCreate: sinon.SinonSpy = sinon.spy(teamRepository, 'create');

            const result: Team = await teamService.create(new Team(null, null, null, null), 'email-address');

            expect(teamRepositoryCreate.args[0][0].participants.find((participant) => participant.emailAddress === 'email-address')).to.be.not.null;
        });

        it('should set all participants accepted to false', async () => {
            const teamRepositoryCreate: sinon.SinonSpy = sinon.spy(teamRepository, 'create');

            const result: Team = await teamService.create(new Team(null, null, null, null), 'email-address');

            expect(teamRepositoryCreate.args[0][0].participants.filter((participant) => participant.accepted).length).to.be.eq(0);
        });

    });

    describe('update', () => {

        it('should throw error given non existing error', async () => {
            try {
                const result: Team = await teamService.update(new Team(null, null, null, null), 'email-address');
                throw new Error('Expected Error');
            } catch (err) {
                expect(err.message).to.be.eq('Team does not exist.');
            }
        });

        it('should return team', async () => {
            sinon.stub(teamRepository, 'find').returns(new Team(null, null, new TeamOwner(null, null, 1), null));

            const result: Team = await teamService.update(new Team(null, null, new TeamOwner(null, null, 1), null), 'email-address');

            expect(result).to.be.not.null;
        });

        it('should throw error given incorrect owner', async () => {
            try {
                sinon.stub(teamRepository, 'find').returns(new Team(null, null, new TeamOwner(null, null, 2), null));

                const result: Team = await teamService.update(new Team(null, null, new TeamOwner(null, null, 2), null), 'email-address');
                throw new Error('Expected Error');
            } catch (err) {
                expect(err.message).to.be.eq('You are not the owner of this team.');
            }
        });

        it('should remove removed participants', async () => {
            sinon.stub(teamRepository, 'find').returns(new Team(null, null, new TeamOwner(null, null, 1), [
                new TeamParticipant(false, null, null, 1),
                new TeamParticipant(false, null, null, 2),
                new TeamParticipant(false, null, null, 3),
            ]));

            const teamRepositoryUpdate: sinon.SinonSpy = sinon.spy(teamRepository, 'update');

            const result: Team = await teamService.update(new Team(null, null, new TeamOwner(null, null, 1), [
                new TeamParticipant(false, null, null, 1),
                new TeamParticipant(false, null, null, 3),
            ]), 'email-address');

            expect(teamRepositoryUpdate.args[0][0].participants.length).to.be.eq(2);
        });

        it('should add added participants', async () => {
            sinon.stub(teamRepository, 'find').returns(new Team(null, null, new TeamOwner(null, null, 1), [
                new TeamParticipant(false, null, null, 1),
                new TeamParticipant(false, null, null, 2),
                new TeamParticipant(false, null, null, 3),
            ]));

            const teamRepositoryUpdate: sinon.SinonSpy = sinon.spy(teamRepository, 'update');

            const result: Team = await teamService.update(new Team(null, null, new TeamOwner(null, null, 1), [
                new TeamParticipant(false, null, null, 1),
                new TeamParticipant(false, null, null, 2),
                new TeamParticipant(false, null, null, 3),
                new TeamParticipant(false, null, null, 4),
            ]), 'email-address');

            expect(teamRepositoryUpdate.args[0][0].participants.length).to.be.eq(4);
        });

        it('should add added participants with accepted to false', async () => {
            sinon.stub(teamRepository, 'find').returns(new Team(null, null, new TeamOwner(null, null, 1), [
                new TeamParticipant(false, null, null, 1),
                new TeamParticipant(false, null, null, 2),
                new TeamParticipant(false, null, null, 3),
            ]));

            const teamRepositoryUpdate: sinon.SinonSpy = sinon.spy(teamRepository, 'update');

            const result: Team = await teamService.update(new Team(null, null, new TeamOwner(null, null, 1), [
                new TeamParticipant(false, null, null, 1),
                new TeamParticipant(false, null, null, 2),
                new TeamParticipant(false, null, null, 3),
                new TeamParticipant(true, null, null, 4),
            ]), 'email-address');

            expect(teamRepositoryUpdate.args[0][0].participants[3].accepted).to.be.false;
        });

    });
});
