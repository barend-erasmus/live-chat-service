import { ErrorField } from '../models/error-field';
import { DietFormulatorError } from './diet-formulator-error';

export class ValidationError extends DietFormulatorError {
    constructor(
        code: string,
        detailedMessage: string,
        public errorFields: ErrorField[],
    ) {
        super(code, detailedMessage);
    }
}
