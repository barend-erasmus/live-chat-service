import { injectable } from 'inversify';
import 'reflect-metadata';
import * as Sequelize from 'sequelize';

import { Message } from '../../entities/message';
import { MetaDatum } from '../../value-objects/meta-datum';
import { IMessageRepository } from '../message';
import { BaseRepository } from './base';

@injectable()
export class MessageRepository extends BaseRepository implements IMessageRepository {

    constructor() {
        super();
    }

    public async create(message: Message): Promise<Message> {
        const result: any = await BaseRepository.models.Message.create({
            chatId: message.chat.id,
            sender: message.sender,
            text: message.text,
            timestamp: message.timestamp.getTime(),
        });

        return this.find(result.id);
    }

    public async find(messageId: number): Promise<Message> {
        const result: any = await BaseRepository.models.Message.find({
            include: [
                {
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
                    model: BaseRepository.models.Chat,
                },
            ],
            where: {
                id: {
                    [Sequelize.Op.eq]: messageId,
                },
            },
        });

        if (!result) {
            return null;
        }

        return this.mapToMessage(result);
    }

    public async list(chatId: number): Promise<Message[]> {
        const result: any[] = await BaseRepository.models.Message.findAll({
            include: [
                {
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
                    model: BaseRepository.models.Chat,
                },
            ],
            where: {
                chatId: {
                    [Sequelize.Op.eq]: chatId,
                },
            },
        });

        return result.map((team) => this.mapToMessage(team));
    }

    public async update(message: Message): Promise<Message> {
        throw new Error();
    }
}
