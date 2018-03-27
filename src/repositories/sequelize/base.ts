import { injectable } from 'inversify';
import 'reflect-metadata';
import * as Sequelize from 'sequelize';

import { Application } from '../../entities/application';
import { Chat } from '../../entities/chat';
import { Message } from '../../entities/message';
import { Team } from '../../entities/team';
import { User } from '../../entities/user';
import { ApplicationView } from '../../entity-views/application';
import { ChatView } from '../../entity-views/chat';
import { ChatOwnerView } from '../../entity-views/chat-owner';
import { TeamOwnerView } from '../../entity-views/team-owner';
import { TeamParticipantView } from '../../entity-views/team-participant';
import { MetaDatum } from '../../value-objects/meta-datum';
import { Models } from './models';

@injectable()
export class BaseRepository {

    protected static models: {
        Application: Sequelize.Model<{}, {}>,
        Chat: Sequelize.Model<{}, {}>,
        ChatRecipient: Sequelize.Model<{}, {}>,
        Message: Sequelize.Model<{}, {}>,
        MetaDatum: Sequelize.Model<{}, {}>,
        Team: Sequelize.Model<{}, {}>,
        TeamParticipant: Sequelize.Model<{}, {}>,
        User: Sequelize.Model<{}, {}>,
    } = null;

    protected static sequelize: Sequelize.Sequelize = null;

    constructor() {
        this.initialize();
    }

    public dispose(): void {
        if (BaseRepository.sequelize) {
            BaseRepository.sequelize.close();
            BaseRepository.sequelize = null;
        }
    }

    public initialize(): void {
        if (!BaseRepository.sequelize) {
            BaseRepository.sequelize = new Sequelize('live-chat', null, null, {
                dialect: 'sqlite',
                logging: false,
                operatorsAliases: false,
                storage: 'database.sqlite',
            });

            BaseRepository.models = Models.define(BaseRepository.sequelize);
        }
    }

    public sync(): Promise<void> {
        return new Promise((resolve, reject) => {
            BaseRepository.sequelize.sync({ force: true }).then(() => {
                resolve();
            });
        });
    }

    protected mapToApplication(application: any): Application {
        return new Application(
            application.id,
            application.name,
            this.mapToTeam(application.team),
        );
    }

    protected mapToChat(chat: any, numerOfUnreadMessages: number): Chat {
        return new Chat(
            new ApplicationView(chat.application.id, chat.application.name),
            chat.id,
            chat.metaData.map((metaDatum: any) => new MetaDatum(metaDatum.name, metaDatum.value)),
            numerOfUnreadMessages,
            chat.chatOwner ? new ChatOwnerView(chat.chatOwner.emailAddress, chat.chatOwner.displayName, chat.chatOwner.id) : null,
            chat.sessionId,
        );
    }

    protected mapToMessage(message: any): Message {
        return new Message(new ChatView(
            new ApplicationView(message.chat.application.id, message.chat.application.name),
            message.chat.id,
            message.chat.metaData.map((x) => new MetaDatum(x.name, x.value)),
            message.chat.chatOwner ? new ChatOwnerView(message.chat.chatOwner.emailAddress, message.chat.chatOwner.displayName, message.chat.chatOwner.id) : null,
            message.chat.sessionId,
        ),
            message.id,
            message.sender,
            message.text,
            new Date(message.createdAt),
        );
    }

    protected mapToTeam(team: any): Team {
        return new Team(
            team.id,
            team.name,
            new TeamOwnerView(team.teamOwner.emailAddress, team.teamOwner.displayName, team.teamOwner.id),
            team.teamParticipants.map((participant) => new TeamParticipantView(participant.accepted, participant.user.emailAddress, participant.user.displayName, participant.user.id)),
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
