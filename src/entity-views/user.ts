import { EntityView } from './entity-view';

export class UserView extends EntityView {

    constructor(
        public emailAddress: string,
        public displayName: string,
        id: number,
    ) {
        super(id);
    }
}
