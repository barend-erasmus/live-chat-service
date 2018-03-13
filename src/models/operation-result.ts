import { ValidationMessage } from './validation-message';

export class OperationResult<T> {

    public messages: ValidationMessage[] = [];

    constructor(public result: T) {

    }

    public static create<T>(result: T): OperationResult<T> {
        return new OperationResult<T>(result);
    }

    public addMessage(code: string, field: string, message: string): OperationResult<T> {
        this.messages.push(new ValidationMessage(field, message));

        return this;
    }

    public hasErrors(): boolean {
        return this.messages.length > 0;
    }

    public setResult(result: T): OperationResult<T> {
        this.result = result;

        return this;
    }

}
