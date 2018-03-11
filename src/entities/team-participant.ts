import { User } from './user';

export class TeamParticipant extends User {

    constructor(
        public accepted: boolean,
        emailAddress: string,
        displayName: string,
        id: number,
    ) {
        super(emailAddress, displayName, id);
    }
}
