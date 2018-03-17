import { UserView } from './user';

export class TeamParticipantView extends UserView {

    constructor(
        public accepted: boolean,
        emailAddress: string,
        displayName: string,
        id: number,
    ) {
        super(emailAddress, displayName, id);
    }
}
