import { Application } from './application';
import { MetaDatum } from './meta-datum';

export class Chat {

    constructor(
        public application: Application,
        public id: number,
        public metaData: MetaDatum[],
        public numberofUnreadMessages: number,
        public owner: string,
        public sessionId: string,
    ) {

    }
}
