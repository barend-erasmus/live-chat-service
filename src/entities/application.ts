import { TeamView } from '../entity-views/team';
import { Entity } from './entity';

export class Application extends Entity {

    constructor(
        id: number,
        public name: string,
        public team: TeamView,
    ) {
        super(id);
    }
}
