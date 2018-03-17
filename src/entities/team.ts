import { TeamOwnerView } from '../entity-views/team-owner';
import { TeamParticipantView } from '../entity-views/team-participant';

export class Team {

    constructor(
        public id: number,
        public name: string,
        public owner: TeamOwnerView,
        public participants: TeamParticipantView[],
    ) {

    }
}
