import { UserView } from './user';

export class ChatOwnerView extends UserView {

    constructor(
        emailAddress: string,
        displayName: string,
        id: number,
    ) {
        super(emailAddress, displayName, id);
    }
}
