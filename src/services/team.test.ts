import { expect } from 'chai';
import 'mocha';
import { Team } from '../entities/team';
import { TeamOwner } from '../entities/team-owner';
import { container } from '../ioc';
import { setupTest } from '../test-base';
import { TestData } from '../test-data';
import { TeamService } from './team';

describe('TeamService', () => {

    let teamService: TeamService = null;

    beforeEach(async () => {
        await setupTest();

        teamService = container.get<TeamService>('TeamService');
    });

    describe('create', () => {

        it('should return team', async () => {
            const result: Team = await teamService.create(TestData.getInstance().NON_EXISTING_TEAM, TestData.getInstance().EXISTING_TEAM_OWNER.emailAddress);

            expect(result).to.be.not.null;
        });

        it('should return team with owner given null owner', async () => {
            const result: Team = await teamService.create(TestData.getInstance().NON_EXISTING_TEAM, TestData.getInstance().EXISTING_TEAM_OWNER.emailAddress);

            expect(result.owner).to.be.not.null;
        });

        it('should return team with owner as participant', async () => {
            const result: Team = await teamService.create(TestData.getInstance().NON_EXISTING_TEAM, TestData.getInstance().EXISTING_TEAM_OWNER.emailAddress);

            expect(result.participants.find((participant) => participant.emailAddress === TestData.getInstance().EXISTING_TEAM_OWNER.emailAddress)).to.be.not.null;
        });

    });

    describe('update', () => {

        it('should throw error given non existing error', async () => {
            try {
                const result: Team = await teamService.update(TestData.getInstance().NON_EXISTING_TEAM, TestData.getInstance().EXISTING_TEAM_OWNER.emailAddress);
                throw new Error('Expected Error');
            } catch (err) {
                expect(err.message).to.be.not.eq('Expected Error');
            }
        });

        it('should return team', async () => {
            const result: Team = await teamService.update(TestData.getInstance().EXISTING_TEAM, TestData.getInstance().EXISTING_TEAM_OWNER.emailAddress);

            expect(result).to.be.not.null;
        });

        it('should throw error given incorrect owner', async () => {
            try {
                const result: Team = await teamService.update(TestData.getInstance().EXISTING_TEAM, TestData.getInstance().EXISTING_TEAM_OWNER_OTHER.emailAddress);
                throw new Error('Expected Error');
            } catch (err) {
                expect(err.message).to.be.not.eq('Expected Error');
            }
        });

    });
});
