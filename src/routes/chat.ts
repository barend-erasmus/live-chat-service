import * as express from 'express';

import { Chat } from '../entities/chat';
import { LiveChatError } from '../errors/live-chat-error';
import { container } from '../ioc';
import { OperationResult } from '../models/operation-result';
import { ChatService } from '../services/chat';
import { BaseRouter } from './base';

export class ChatRouter extends BaseRouter {

    public static async get(req: express.Request, res: express.Response) {
        try {
            if (req.query.chatId) {
                const result: OperationResult<Chat> = await container.get<ChatService>('ChatService').find(req.query.chatId, req['user']['emailAddress']);

                ChatRouter.sendOperationResult(res, result);
            } else {
                const result: OperationResult<Chat[]> = await container.get<ChatService>('ChatService').list(req.query.applicationId, req['user']['emailAddress']);

                ChatRouter.sendOperationResult(res, result);
            }
        } catch (err) {
            res.status(500).json(LiveChatError.fromError(err));
        }
    }

    public static async post(req: express.Request, res: express.Response) {
        try {
            const result: OperationResult<Chat> = await container.get<ChatService>('ChatService').create(req.body, req['user']['emailAddress']);

            ChatRouter.sendOperationResult(res, result);
        } catch (err) {
            res.status(500).json(LiveChatError.fromError(err));
        }
    }

    public static async put(req: express.Request, res: express.Response) {
        try {
            const result: OperationResult<Chat> = await container.get<ChatService>('ChatService').update(req.body, req['user']['emailAddress']);

            ChatRouter.sendOperationResult(res, result);
        } catch (err) {
            res.status(500).json(LiveChatError.fromError(err));
        }
    }
}
