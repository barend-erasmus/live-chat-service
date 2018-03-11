import { Team } from '../entities/team';
import { TeamOwner } from '../entities/team-owner';

export class TestData {

    public static EXISTING_TEAM_OWNER: TeamOwner = new TeamOwner('john.smith@example.com', 'John Smith', null);

    public static NON_EXISTING_TEAM_OWNER: TeamOwner = new TeamOwner('john.smith@example.com', 'John Smith', null);
    public static NON_EXISTING_TEAM: Team = new Team(null, 'Team 1', TestData.EXISTING_TEAM_OWNER, []);
}
