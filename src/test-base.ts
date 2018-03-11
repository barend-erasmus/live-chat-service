import { container } from './ioc';
import { BaseRepository } from './repositories/sequelize/base';
import { ITeamRepository } from './repositories/team';
import { IUserRepository } from './repositories/user';
import { TestData } from './test-data';

export async function setupTest() {
    const teamRepository: ITeamRepository = container.get<ITeamRepository>('ITeamRepository');
    const userRepository: IUserRepository = container.get<IUserRepository>('IUserRepository');

    const baseRepository: BaseRepository = new BaseRepository();

    await baseRepository.sync();

    TestData.EXISTING_TEAM_OWNER = await userRepository.create(TestData.EXISTING_TEAM_OWNER, 'token');

    TestData.EXISTING_TEAM_OWNER_OTHER = await userRepository.create(TestData.EXISTING_TEAM_OWNER_OTHER, 'token');

    TestData.EXISTING_TEAM = await teamRepository.create(TestData.EXISTING_TEAM);
}
