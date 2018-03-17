import { UserView } from './user';

export class MessageSenderView extends UserView {

    constructor(
        emailAddress: string,
        displayName: string,
        id: number,
    ) {
        super(emailAddress, displayName, id);
    }
}
