import { User } from './user';

export class TeamOwner extends User {

    constructor(
        emailAddress: string,
        displayName: string,
    ) {
        super(emailAddress, displayName);
    }
}
