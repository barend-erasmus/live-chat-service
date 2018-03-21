import { inject, injectable } from 'inversify';
import 'reflect-metadata';

import { Chat } from '../entities/chat';
import { Message } from '../entities/message';
import { OperationResult } from '../models/operation-result';
import { IChatRepository } from '../repositories/chat';
import { IMessageRepository } from '../repositories/message';
import { ITeamRepository } from '../repositories/team';
import { IUserRepository } from '../repositories/user';

@injectable()
export class MessageService {

    constructor(
        @inject('IChatRepository')
        private chatRepository: IChatRepository,
        @inject('IMessageRepository')
        private messageRepository: IMessageRepository,
        @inject('ITeamRepository')
        private teamRepository: ITeamRepository,
        @inject('IUserRepository')
        private userRepository: IUserRepository,
    ) {
    }

    public async create(message: Message, userName: string): Promise<OperationResult<Message>> {
        const result: OperationResult<Message> = OperationResult.create<Message>(null);

        await this.validateMessage(message, result);

        if (result.hasErrors()) {
            return result;
        }

        message = await this.messageRepository.create(message);

        result.setResult(message);

        return result;
    }

    public async find(messageId: number, userName: string): Promise<OperationResult<Message>> {
        const message: Message = await this.messageRepository.find(messageId);

        return OperationResult.create<Message>(message);
    }

    public async list(chatId: number, userName: string): Promise<OperationResult<Message[]>> {
        const messages: Message[] = await this.messageRepository.list(chatId);

        return OperationResult.create<Message[]>(messages);
    }

    public async update(message: Message, userName: string): Promise<OperationResult<Message>> {
        const result: OperationResult<Message> = OperationResult.create<Message>(null);

        await this.validateMessage(message, result);

        if (result.hasErrors()) {
            return result;
        }

        const exisitingMessage: Message = await this.messageRepository.find(message.id);

        if (!exisitingMessage) {
            result.addMessage('not_found', null, 'Message does not exist.');
            return result;
        }

        exisitingMessage.chat = message.chat;
        exisitingMessage.sender = message.sender;
        exisitingMessage.text = message.text;
        exisitingMessage.timestamp = message.timestamp;

        message = await this.messageRepository.update(exisitingMessage);

        return result;
    }

    private async validateMessage(message: Message, result: OperationResult<Message>): Promise<void> {
        if (!message.chat) {
            result.addMessage('validation', null, 'Message requires a chat.');
            return;
        }

        const chat: Chat = await this.chatRepository.find(message.chat.id);

        if (!chat) {
            result.addMessage('not_found', null, 'Chat does not exist.');
            return;
        }

        if (!message.sender) {
            result.addMessage('validation', null, 'Chat requires a sender.');
            return;
        }

        if (!message.text) {
            result.addMessage('validation', null, 'Chat requires a text.');
            return;
        }

        if (!message.timestamp) {
            result.addMessage('validation', null, 'Chat requires a timestamp.');
            return;
        }
    }
}
