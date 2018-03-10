import { User } from './user';

export class ChatOwner extends User {

    constructor(
        emailAddress: string,
        displayName: string,
    ) {
        super(emailAddress, displayName);
    }
}
