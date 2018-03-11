import { expect } from 'chai';
import 'mocha';
import { Team } from '../entities/team';
import { TeamOwner } from '../entities/team-owner';
import { container } from '../ioc';
import { BaseRepository } from './sequelize/base';
import { ITeamRepository } from './team';
import { TestData } from './test-data';
import { IUserRepository } from './user';

describe('TeamRepository', () => {

    let teamRepository: ITeamRepository = null;
    let userRepository: IUserRepository = null;

    before(async () => {
        const baseRepository: BaseRepository = new BaseRepository();

        teamRepository = container.get<ITeamRepository>('ITeamRepository');
        userRepository = container.get<IUserRepository>('IUserRepository');

        await baseRepository.sync();

        TestData.EXISTING_TEAM_OWNER = await userRepository.create(TestData.EXISTING_TEAM_OWNER, 'token');
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
