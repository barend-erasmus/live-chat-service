import { Entity } from './entity';
import { Team } from './team';

export class Application extends Entity {

    constructor(
        id: number,
        public name: string,
        public team: Team,
    ) {
        super(id);
    }
}
