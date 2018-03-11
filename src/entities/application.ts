import { Team } from './team';
import { Entity } from './entity';

export class Application extends Entity {

    constructor(
        id: number,
        public name: string,
        public team: Team,
    ) {
        super(id);
    }
}
