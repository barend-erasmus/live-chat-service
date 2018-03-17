import { UserView } from './user';

export class TeamOwnerView extends UserView {

    constructor(
        emailAddress: string,
        displayName: string,
        id: number,
    ) {
        super(emailAddress, displayName, id);
    }
}
