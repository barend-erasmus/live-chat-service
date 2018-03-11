import { TeamOwner } from './team-owner';
import { TeamParticipant } from './team-participant';

export class Team {

    constructor(
        public id: number,
        public name: string,
        public owner: TeamOwner,
        public participants: TeamParticipant[],
    ) {

    }
}
