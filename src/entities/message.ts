import { ChatView } from '../entity-views/chat';
import { MessageSenderView } from '../entity-views/message-sender';
import { Entity } from './entity';

export class Message extends Entity {

    constructor(
        public chat: ChatView,
        id: number,
        public sender: MessageSenderView,
        public text: string,
        public timestamp: Date,
    ) {
        super(id);
    }
}
