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

    before(async () => {
        await setupTest();

        teamService = container.get<TeamService>('TeamService');
    });

    describe('update', () => {

        it('should throw error given non existing error', async () => {

            try {
                const result: Team = await teamService.update(TestData.NON_EXISTING_TEAM, TestData.EXISTING_TEAM_OWNER.emailAddress);
                throw new Error('Expected Error');
            } catch (err) {
                expect(err.message).to.be.not.eq('Expected Error');
            }
        });

        it('should return team', async () => {

            const result: Team = await teamService.update(TestData.EXISTING_TEAM, TestData.EXISTING_TEAM_OWNER.emailAddress);

            expect(result).to.be.not.null;
        });

        it('should throw error given incorrect owner', async () => {

            try {
                const result: Team = await teamService.update(TestData.EXISTING_TEAM, TestData.EXISTING_TEAM_OWNER_OTHER.emailAddress);
                throw new Error('Expected Error');
            } catch (err) {
                expect(err.message).to.be.not.eq('Expected Error');
            }
        });

    });
});
