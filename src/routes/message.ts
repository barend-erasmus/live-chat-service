import * as express from 'express';

import { Message } from '../entities/message';
import { LiveChatError } from '../errors/live-chat-error';
import { container } from '../ioc';
import { OperationResult } from '../models/operation-result';
import { MessageService } from '../services/message';
import { BaseRouter } from './base';

export class MessageRouter extends BaseRouter {

    public static async get(req: express.Request, res: express.Response) {
        try {
            if (req.query.messageId) {
                const result: OperationResult<Message> = await container.get<MessageService>('MessageService').find(req.query.messageId, req['user']['emailAddress']);

                MessageRouter.sendOperationResult(res, result);
            } else {
                const result: OperationResult<Message[]> = await container.get<MessageService>('MessageService').list(req.query.chatId, req['user']['emailAddress']);

                MessageRouter.sendOperationResult(res, result);
            }
        } catch (err) {
            res.status(500).json(LiveChatError.fromError(err));
        }
    }

    public static async post(req: express.Request, res: express.Response) {
        try {
            const result: OperationResult<Message> = await container.get<MessageService>('MessageService').create(req.body, req['user']['emailAddress']);

            MessageRouter.sendOperationResult(res, result);
        } catch (err) {
            res.status(500).json(LiveChatError.fromError(err));
        }
    }

    public static async put(req: express.Request, res: express.Response) {
        try {
            const result: OperationResult<Message> = await container.get<MessageService>('MessageService').update(req.body, req['user']['emailAddress']);

            MessageRouter.sendOperationResult(res, result);
        } catch (err) {
            res.status(500).json(LiveChatError.fromError(err));
        }
    }
}
