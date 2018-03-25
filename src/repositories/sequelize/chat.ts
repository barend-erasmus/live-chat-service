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

    public async create(chat: Chat): Promise<Chat> {
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

        return this.find(result.id);
    }

    public async find(chatId: number): Promise<Chat> {
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

        // TODO:
        const messageResult: any[] = await BaseRepository.models.Message.findAll({
            where: {
                chatId: {
                    [Sequelize.Op.eq]: result.id,
                },
            },
        });

        return this.mapToChat(result, messageResult.length);
    }

    public async findBySessionId(sessionId: string): Promise<Chat> {
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

        // TODO:
        const messageResult: any[] = await BaseRepository.models.Message.findAll({
            where: {
                chatId: {
                    [Sequelize.Op.eq]: result.id,
                },
            },
        });

        return this.mapToChat(result, messageResult.length);
    }

    public async list(applicationId: number): Promise<Chat[]> {
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

        // TODO:
        for (const item of result) {
            const messageResult: any[] = await BaseRepository.models.Message.findAll({
                where: {
                    chatId: {
                        [Sequelize.Op.eq]: item.id,
                    },
                },
            });

            chats.push(this.mapToChat(item, messageResult.length));
        }

        return chats;
    }

    public async update(chat: Chat): Promise<Chat> {
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

        return this.find(chat.id);
    }
}
