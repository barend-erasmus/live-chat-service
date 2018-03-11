import { TeamOwner } from "./entities/team-owner";
import { Team } from "./entities/team";

export class TestData {

    public static EXISTING_TEAM_OWNER: TeamOwner = new TeamOwner('john.smith@example.com', 'John Smith', null);
    public static EXISTING_TEAM_OWNER_OTHER: TeamOwner = new TeamOwner('hello.world@example.com', 'Hello World', null);
    public static EXISTING_TEAM: Team = new Team(null, 'Existing Team', TestData.EXISTING_TEAM_OWNER, []);

    public static NON_EXISTING_TEAM: Team = new Team(null, 'Non Existing Team', TestData.EXISTING_TEAM_OWNER, []);
    public static NON_EXISTING_TEAM_OWNER: TeamOwner = new TeamOwner('john.smith@example.com', 'John Smith', null);
    
}
