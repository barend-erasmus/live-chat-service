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

        await this.validateChat(chat, result);

        if (result.hasErrors()) {
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

    public async findBySessionId(sessionId: string, userName: string): Promise<OperationResult<Chat>> {
        const chat: Chat = await this.chatRepository.findBySessionId(sessionId);

        return OperationResult.create<Chat>(chat);
    }

    public async list(applicationId: number, userName: string): Promise<OperationResult<Chat[]>> {
        const chats: Chat[] = await this.chatRepository.list(applicationId);

        return OperationResult.create<Chat[]>(chats);
    }

    public async update(chat: Chat, userName: string): Promise<OperationResult<Chat>> {
        const result: OperationResult<Chat> = OperationResult.create<Chat>(null);

        await this.validateChat(chat, result);

        if (result.hasErrors()) {
            return result;
        }

        const exisitingChat: Chat = await this.chatRepository.find(chat.id);

        if (!exisitingChat) {
            result.addMessage('not_found', null, 'Chat does not exist.');
            return result;
        }

        const user: User = await this.userRepository.findByUserName(userName);

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

    private async validateChat(chat: Chat, result: OperationResult<Chat>): Promise<void> {
        if (!chat.application) {
            result.addMessage('validation', null, 'Chat requires an application.');
            return;
        }

        const application: Application = await this.applicationRepository.find(chat.application.id);

        if (!application) {
            result.addMessage('not_found', null, 'Application does not exist.');
            return;
        }

        if (chat.owner) {
            const owner: User = await this.userRepository.findById(chat.owner.id);

            if (!owner) {
                result.addMessage('not_found', null, 'Owner does not exist.');
                return;
            }
        }

        if (!chat.sessionId) {
            result.addMessage('validation', null, 'Chat requires a session Id.');
            return;
        }
    }
}
