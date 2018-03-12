import { TeamOwner } from './entities/team-owner';
import { TeamParticipant } from './entities/team-participant';
import { container } from './ioc';
import { BaseRepository } from './repositories/sequelize/base';
import { ITeamRepository } from './repositories/team';
import { IUserRepository } from './repositories/user';
import { TestData } from './test-data';

export async function setupTest() {
    const teamRepository: ITeamRepository = container.get<ITeamRepository>('ITeamRepository');
    const userRepository: IUserRepository = container.get<IUserRepository>('IUserRepository');

    const baseRepository: BaseRepository = new BaseRepository();

    baseRepository.dispose();

    baseRepository.initialize();

    await baseRepository.sync();

    TestData.reinitialize();

    TestData.getInstance().EXISTING_TEAM_PARTICIPANT = (await userRepository.create(TestData.getInstance().EXISTING_TEAM_PARTICIPANT, 'token')) as TeamParticipant;

    TestData.getInstance().EXISTING_TEAM_OWNER = (await userRepository.create(TestData.getInstance().EXISTING_TEAM_OWNER, 'token')) as TeamOwner;

    TestData.getInstance().EXISTING_TEAM_OWNER_OTHER = (await userRepository.create(TestData.getInstance().EXISTING_TEAM_OWNER_OTHER, 'token')) as TeamOwner;

    TestData.getInstance().EXISTING_TEAM = await teamRepository.create(TestData.getInstance().EXISTING_TEAM);
}
