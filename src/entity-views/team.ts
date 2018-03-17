import { TeamOwnerView } from './team-owner';

export class TeamView {

    constructor(
        public id: number,
        public name: string,
        public owner: TeamOwnerView,
    ) {

    }
}
