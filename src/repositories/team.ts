import { Team } from '../entities/team';

export interface ITeamRepository {
    create(user: Team): Promise<Team>;
    find(teamId: number): Promise<Team>;
    update(team: Team): Promise<Team>;
}
