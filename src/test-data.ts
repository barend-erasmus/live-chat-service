import { Team } from './entities/team';
import { TeamOwner } from './entities/team-owner';
import { TeamParticipant } from './entities/team-participant';

export class TestData {

    public EXISTING_TEAM_PARTICIPANT: TeamParticipant = new TeamParticipant(false, 'foo.bar@example.com', 'Foo Bar', null);
    public EXISTING_TEAM_OWNER: TeamOwner = new TeamOwner('john.smith@example.com', 'John Smith', null);
    public EXISTING_TEAM_OWNER_OTHER: TeamOwner = new TeamOwner('hello.world@example.com', 'Hello World', null);
    public EXISTING_TEAM: Team = new Team(null, 'Existing Team', this.EXISTING_TEAM_OWNER, []);

    public NON_EXISTING_TEAM: Team = new Team(null, 'Non Existing Team', this.EXISTING_TEAM_OWNER, []);
    public NON_EXISTING_TEAM_OWNER: TeamOwner = new TeamOwner('john.smith@example.com', 'John Smith', null);

    private static instance: TestData;

    public static getInstance(): TestData {
        if (!TestData.instance) {
            TestData.instance = new TestData();
        }

        return TestData.instance;
    }

    public static reinitialize(): void {
        TestData.instance = new TestData();
    }
}
