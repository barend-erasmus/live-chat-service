import { Application } from './application';
import { ChatOwner } from './chat-owner';
import { MetaDatum } from './meta-datum';

export class Chat {

    constructor(
        public application: Application,
        public id: number,
        public metaData: MetaDatum[],
        public numberofUnreadMessages: number,
        public owner: ChatOwner,
        public sessionId: string,
    ) {

    }
}
