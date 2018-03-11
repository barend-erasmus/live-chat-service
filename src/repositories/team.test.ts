import { expect } from 'chai';
import 'mocha';
import { Team } from '../entities/team';
import { TeamOwner } from '../entities/team-owner';
import { container } from '../ioc';
import { BaseRepository } from './sequelize/base';
import { ITeamRepository } from './team';
import { IUserRepository } from './user';
import { setupTest } from '../test-base';
import { TestData } from '../test-data';

describe('TeamRepository', () => {

    let teamRepository: ITeamRepository = null;

    before(async () => {
        await setupTest();

        teamRepository = container.get<ITeamRepository>('ITeamRepository');
    });

    describe('create', () => {

        it('should return team', async () => {

            const result: Team = await teamRepository.create(TestData.NON_EXISTING_TEAM);

            expect(result).to.be.not.null;
        });

        it('should persist team', async () => {

            const createdTeam: Team = await teamRepository.create(TestData.NON_EXISTING_TEAM);

            const result: Team = await teamRepository.find(createdTeam.id);

            expect(result).to.be.not.null;
        });

    });
});
