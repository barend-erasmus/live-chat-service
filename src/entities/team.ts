import { TeamOwner } from './team-owner';

export class Team {

    constructor(
        public id: number,
        public name: string,
        public owner: TeamOwner,
    ) {

    }
}
