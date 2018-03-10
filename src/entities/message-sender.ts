import { User } from './user';

export class MessageSender extends User {

    constructor(
        emailAddress: string,
        displayName: string,
    ) {
        super(emailAddress, displayName);
    }
}
