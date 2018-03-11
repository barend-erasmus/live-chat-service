import { Entity } from './entity';

export class User extends Entity {

    constructor(
        public emailAddress: string,
        public displayName: string,
        id: number,
    ) {
        super(id);
    }
}
