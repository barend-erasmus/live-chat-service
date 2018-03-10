import { Application } from './application';

export class Message {

    constructor(
        public application: Application,
        public from: string,
        public message: string,
        public timestamp: Date,
    ) {

    }
}
