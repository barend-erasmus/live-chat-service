import { User } from './user';

export class TeamParticipant extends User {

    constructor(
        public accepted: boolean,
        emailAddress: string,
        displayName: string,
    ) {
        super(emailAddress, displayName);
    }
}
