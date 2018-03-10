import { Application } from './application';
import { MessageSender } from './message-sender';

export class Message {

    constructor(
        public application: Application,
        public sender: MessageSender,
        public text: string,
        public timestamp: Date,
    ) {

    }
}
