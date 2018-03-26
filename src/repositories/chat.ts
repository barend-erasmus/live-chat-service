import { Chat } from '../entities/chat';

export interface IChatRepository {
    create(chat: Chat): Promise<Chat>;
    find(chatId: number): Promise<Chat>;
    findBySessionId(sessionId: string): Promise<Chat>;
    markAsRead(chatId: number, timestamp: Date, userName: string): Promise<void>;
    list(applicationId: number): Promise<Chat[]>;
    update(chat: Chat): Promise<Chat>;
}
