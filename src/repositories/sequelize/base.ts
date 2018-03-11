import * as Sequelize from 'sequelize';
import { User } from '../../entities/user';
import { Models } from './models';
import { injectable } from 'inversify';
import { Team } from '../../entities/team';
import { TeamOwner } from '../../entities/team-owner';
import { TeamParticipant } from '../../entities/team-participant';

@injectable()
export class BaseRepository {

    protected static models: {
        Application: Sequelize.Model<{}, {}>,
        Chat: Sequelize.Model<{}, {}>,
        Message: Sequelize.Model<{}, {}>,
        MetaDatum: Sequelize.Model<{}, {}>,
        Team: Sequelize.Model<{}, {}>,
        TeamParticipant: Sequelize.Model<{}, {}>, 
        User: Sequelize.Model<{}, {}>,
    } = null;

    protected static sequelize: Sequelize.Sequelize = null;

    constructor() {
        if (!BaseRepository.sequelize) {

            BaseRepository.sequelize = new Sequelize('live-chat', null, null, {
                dialect: 'sqlite',
                logging: false,
                storage: 'database.sqlite',
            });

            BaseRepository.models = Models.define(BaseRepository.sequelize);
        }
    }

    public dispose(): void {
        if (BaseRepository.sequelize) {
            BaseRepository.sequelize.close();
            BaseRepository.sequelize = null;
        }
    }

    public sync(): Promise<void> {
        return new Promise((resolve, reject) => {
            BaseRepository.sequelize.sync({ force: true }).then(() => {
                resolve();
            });
        });
    }

    protected mapToTeam(team: any): Team {
        return new Team(
            team.id,
            team.name,
            new TeamOwner(team.teamOwner.emailAddress, team.teamOwner.displayName, team.teamOwner.id),
            team.teamParticipants.map((participant) => new TeamParticipant(participant.accepted, participant.emailAddress, participant.displayName, participant.id)),
        );
    }

    protected mapToUser(user: any): User {
        return new User(
            user.emailAddress,
            user.displayName,
            user.id,
        );
    }
}
