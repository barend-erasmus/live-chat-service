import { expect } from 'chai';
import 'mocha';
import { Team } from '../entities/team';
import { TeamOwner } from '../entities/team-owner';
import { container } from '../ioc';
import { setupTest } from '../test-base';
import { TestData } from '../test-data';
import { BaseRepository } from './sequelize/base';
import { ITeamRepository } from './team';
import { IUserRepository } from './user';

describe('TeamRepository', () => {

    let teamRepository: ITeamRepository = null;

    beforeEach(async () => {
        await setupTest();

        teamRepository = container.get<ITeamRepository>('ITeamRepository');
    });

    describe('create', () => {

        it('should return team', async () => {
            const result: Team = await teamRepository.create(TestData.getInstance().NON_EXISTING_TEAM);

            expect(result).to.be.not.null;
        });

        it('should persist team', async () => {
            const createdTeam: Team = await teamRepository.create(TestData.getInstance().NON_EXISTING_TEAM);

            const result: Team = await teamRepository.find(createdTeam.id);

            expect(result).to.be.not.null;
        });

    });

    describe('update', () => {

        it('should return team', async () => {
            const result: Team = await teamRepository.update(TestData.getInstance().EXISTING_TEAM);

            expect(result).to.be.not.null;
        });

        it('should persist name', async () => {
            TestData.getInstance().EXISTING_TEAM.name = 'Updated';

            const updatedTeam: Team = await teamRepository.update(TestData.getInstance().EXISTING_TEAM);

            const result: Team = await teamRepository.find(updatedTeam.id);

            expect(result.name).to.be.eq('Updated');
        });

        it('should persist participants given new participant', async () => {
            TestData.getInstance().EXISTING_TEAM.participants.push(TestData.getInstance().EXISTING_TEAM_PARTICIPANT);

            const updatedTeam: Team = await teamRepository.update(TestData.getInstance().EXISTING_TEAM);

            const result: Team = await teamRepository.find(updatedTeam.id);

            expect(result.participants.length).to.be.eq(1);
        });

        it('should persist participants given remove participant', async () => {
            TestData.getInstance().EXISTING_TEAM.participants.push(TestData.getInstance().EXISTING_TEAM_PARTICIPANT);

            let updatedTeam: Team = await teamRepository.update(TestData.getInstance().EXISTING_TEAM);

            let result: Team = await teamRepository.find(updatedTeam.id);

            expect(result.participants.length).to.be.eq(1);

            TestData.getInstance().EXISTING_TEAM.participants.pop();

            updatedTeam = await teamRepository.update(TestData.getInstance().EXISTING_TEAM);

            result = await teamRepository.find(updatedTeam.id);

            expect(result.participants.length).to.be.eq(0);
        });

    });
});
