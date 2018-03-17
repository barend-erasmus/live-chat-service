import { EntityView } from './entity-view';

export class ApplicationView extends EntityView {

    constructor(
        id: number,
        public name: string,
    ) {
        super(id);
    }
}
