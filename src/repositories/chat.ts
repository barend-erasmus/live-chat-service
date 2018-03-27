import { Chat } from '../entities/chat';

export interface IChatRepository {
    create(chat: Chat, userName: string): Promise<Chat>;
    find(chatId: number, userName: string): Promise<Chat>;
    findBySessionId(sessionId: string, userName: string): Promise<Chat>;
    markAsRead(chatId: number, timestamp: Date, userName: string): Promise<void>;
    list(applicationId: number, userName: string): Promise<Chat[]>;
    update(chat: Chat, userName: string): Promise<Chat>;
}
