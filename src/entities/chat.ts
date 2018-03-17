import { ApplicationView } from '../entity-views/application';
import { ChatOwnerView } from '../entity-views/chat-owner';
import { MetaDatum } from '../value-objects/meta-datum';

export class Chat {

    constructor(
        public application: ApplicationView,
        public id: number,
        public metaData: MetaDatum[],
        public numberofUnreadMessages: number,
        public owner: ChatOwnerView,
        public sessionId: string,
    ) {

    }
}
