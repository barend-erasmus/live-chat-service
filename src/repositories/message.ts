import { Message } from '../entities/message';

export interface IMessageRepository {
    create(message: Message): Promise<Message>;
    find(messageId: number): Promise<Message>;
    list(chatId: number): Promise<Message[]>;
    update(message: Message): Promise<Message>;
}
