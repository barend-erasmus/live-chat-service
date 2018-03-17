import { ApplicationView } from '../entity-views/application';
import { MessageSenderView } from '../entity-views/message-sender';
import { Entity } from './entity';

export class Message extends Entity {

    constructor(
        public application: ApplicationView,
        id: number,
        public sender: MessageSenderView,
        public text: string,
        public timestamp: Date,
    ) {
        super(id);
    }
}
