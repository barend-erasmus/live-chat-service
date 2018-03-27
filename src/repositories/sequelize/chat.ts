import { injectable } from 'inversify';
import 'reflect-metadata';
import * as Sequelize from 'sequelize';

import { Chat } from '../../entities/chat';
import { MetaDatum } from '../../value-objects/meta-datum';
import { IChatRepository } from '../chat';
import { BaseRepository } from './base';

@injectable()
export class ChatRepository extends BaseRepository implements IChatRepository {

    constructor() {
        super();
    }

    public async create(chat: Chat, userName: string): Promise<Chat> {
        const result: any = await BaseRepository.models.Chat.create({
            applicationId: chat.application.id,
            chatOwnerId: chat.owner ? chat.owner.id : null,
            metaData: chat.metaData.map((metaDatum: MetaDatum) => {
                return {
                    name: metaDatum.name,
                    value: metaDatum.value,
                };
            }),
            sessionId: chat.sessionId,
        }, {
                include: [
                    {
                        model: BaseRepository.models.MetaDatum,
                    },
                ],
            });

        return this.find(result.id, userName);
    }

    public async find(chatId: number, userName: string): Promise<Chat> {
        const result: any = await BaseRepository.models.Chat.find({
            include: [
                {
                    model: BaseRepository.models.Application,
                },
                {
                    model: BaseRepository.models.MetaDatum,
                },
                {
                    as: 'chatOwner',
                    model: BaseRepository.models.User,
                },
            ],
            where: {
                id: {
                    [Sequelize.Op.eq]: chatId,
                },
            },
        });

        if (!result) {
            return null;
        }

        const chatRecipient: any = await BaseRepository.models.ChatRecipient.find({
            include: [
                {
                    model: BaseRepository.models.User,
                },
            ],
            where: {
                '$user.emailAddress$': {
                    [Sequelize.Op.eq]: userName,
                },
                'chatId': {
                    [Sequelize.Op.eq]: result.id,
                },
            },
        });

        const messageResult: any[] = await BaseRepository.models.Message.findAll({
            where: {
                chatId: {
                    [Sequelize.Op.eq]: result.id,
                },
                createdAt: {
                    [Sequelize.Op.gt]: chatRecipient ? chatRecipient.timestamp : 0,
                },
            },
        });

        return this.mapToChat(result, messageResult.length);
    }

    public async findBySessionId(sessionId: string, userName: string): Promise<Chat> {
        const result: any = await BaseRepository.models.Chat.find({
            include: [
                {
                    model: BaseRepository.models.Application,
                },
                {
                    model: BaseRepository.models.MetaDatum,
                },
                {
                    as: 'chatOwner',
                    model: BaseRepository.models.User,
                },
            ],
            where: {
                sessionId: {
                    [Sequelize.Op.eq]: sessionId,
                },
            },
        });

        if (!result) {
            return null;
        }

        const chatRecipient: any = await BaseRepository.models.ChatRecipient.find({
            include: [
                {
                    model: BaseRepository.models.User,
                },
            ],
            where: {
                '$user.emailAddress$': {
                    [Sequelize.Op.eq]: userName,
                },
                'chatId': {
                    [Sequelize.Op.eq]: result.id,
                },
            },
        });

        const messageResult: any[] = await BaseRepository.models.Message.findAll({
            where: {
                chatId: {
                    [Sequelize.Op.eq]: result.id,
                },
                createdAt: {
                    [Sequelize.Op.gt]: chatRecipient ? chatRecipient.timestamp : 0,
                },
            },
        });

        return this.mapToChat(result, messageResult.length);
    }

    public async list(applicationId: number, userName: string): Promise<Chat[]> {
        const result: any[] = await BaseRepository.models.Chat.findAll({
            include: [
                {
                    model: BaseRepository.models.Application,
                },
                {
                    model: BaseRepository.models.MetaDatum,
                },
                {
                    as: 'chatOwner',
                    model: BaseRepository.models.User,
                },
            ],
            where: {
                applicationId: {
                    [Sequelize.Op.eq]: applicationId,
                },
            },
        });

        const chats: Chat[] = [];

        for (const chat of result) {
            const chatRecipient: any = await BaseRepository.models.ChatRecipient.find({
                include: [
                    {
                        model: BaseRepository.models.User,
                    },
                ],
                where: {
                    '$user.emailAddress$': {
                        [Sequelize.Op.eq]: userName,
                    },
                    'chatId': {
                        [Sequelize.Op.eq]: chat.id,
                    },
                },
            });

            const messageResult: any[] = await BaseRepository.models.Message.findAll({
                where: {
                    chatId: {
                        [Sequelize.Op.eq]: chat.id,
                    },
                    createdAt: {
                        [Sequelize.Op.gt]: chatRecipient ? chatRecipient.timestamp : 0,
                    },
                },
            });

            chats.push(this.mapToChat(chat, messageResult.length));
        }

        return chats;
    }

    public async markAsRead(chatId: number, timestamp: Date, userName: string): Promise<void> {
        const existingChatRecipient: any = await BaseRepository.models.ChatRecipient.find({
            include: [
                {
                    model: BaseRepository.models.User,
                },
            ],
            where: {
                '$user.emailAddress$': {
                    [Sequelize.Op.eq]: userName,
                },
                'chatId': {
                    [Sequelize.Op.eq]: chatId,
                },
            },
        });

        if (existingChatRecipient) {
            existingChatRecipient.timestamp = timestamp;

            await existingChatRecipient.save();
        } else {
            const user: any = await BaseRepository.models.User.find({
                where: {
                    emailAddress: {
                        [Sequelize.Op.eq]: userName,
                    },
                },
            });

            await BaseRepository.models.ChatRecipient.create({
                chatId,
                timestamp,
                userId: user.id,
            });
        }
    }

    public async update(chat: Chat, userName: string): Promise<Chat> {
        const result: any = await BaseRepository.models.Message.find({
            include: [
                {
                    model: BaseRepository.models.Application,
                },
                {
                    model: BaseRepository.models.MetaDatum,
                },
                {
                    as: 'chatOwner',
                    model: BaseRepository.models.User,
                },
            ],
            where: {
                id: {
                    [Sequelize.Op.eq]: chat.id,
                },
            },
        });

        // TODO: Implement updates

        await result.save();

        return this.find(chat.id, userName);
    }
}
