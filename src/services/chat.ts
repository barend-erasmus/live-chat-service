import { inject, injectable } from 'inversify';
import 'reflect-metadata';

import { Application } from '../entities/application';
import { Chat } from '../entities/chat';
import { Team } from '../entities/team';
import { User } from '../entities/user';
import { OperationResult } from '../models/operation-result';
import { IApplicationRepository } from '../repositories/application';
import { IChatRepository } from '../repositories/chat';
import { ITeamRepository } from '../repositories/team';
import { IUserRepository } from '../repositories/user';

@injectable()
export class ChatService {

    constructor(
        @inject('IApplicationRepository')
        private applicationRepository: IApplicationRepository,
        @inject('IChatRepository')
        private chatRepository: IChatRepository,
        @inject('ITeamRepository')
        private teamRepository: ITeamRepository,
        @inject('IUserRepository')
        private userRepository: IUserRepository,
    ) {
    }

    public async create(chat: Chat, userName: string): Promise<OperationResult<Chat>> {
        const result: OperationResult<Chat> = OperationResult.create<Chat>(null);

        const user: User = await this.userRepository.findByUserName(userName);

        const application: Application = await this.applicationRepository.find(chat.application.id);

        if (!application) {
            result.addMessage('not_found', null, 'Application does not exist.');
            return result;
        }

        chat = await this.chatRepository.create(chat);

        result.setResult(chat);

        return result;
    }

    public async find(chatId: number, userName: string): Promise<OperationResult<Chat>> {
        const chat: Chat = await this.chatRepository.find(chatId);

        return OperationResult.create<Chat>(chat);
    }

    public async list(teamId: number, userName: string): Promise<OperationResult<Chat[]>> {
        const chats: Chat[] = await this.chatRepository.list(teamId);

        return OperationResult.create<Chat[]>(chats);
    }

    public async update(chat: Chat, userName: string): Promise<OperationResult<Chat>> {
        const result: OperationResult<Chat> = OperationResult.create<Chat>(null);

        const exisitingChat: Chat = await this.chatRepository.find(chat.id);

        const user: User = await this.userRepository.findByUserName(userName);

        const application: Team = await this.teamRepository.find(exisitingChat.application.id);

        if (!application) {
            result.addMessage('not_found', null, 'Application does not exist.');
            return result;
        }

        if (exisitingChat.owner && exisitingChat.owner.id !== user.id) {
            result.addMessage('unauthorized', null, 'You are not the owner of this chat.');
            return result;
        }

        exisitingChat.application = chat.application;
        exisitingChat.metaData = chat.metaData;
        exisitingChat.owner = chat.owner;
        exisitingChat.sessionId = chat.sessionId;

        chat = await this.chatRepository.update(exisitingChat);

        return result;
    }
}
