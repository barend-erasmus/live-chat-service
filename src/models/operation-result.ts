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

    public hasResult(): boolean {
        return this.result ? true : false;
    }

    public setResult(result: T): OperationResult<T> {
        this.result = result;

        return this;
    }

    public toString(): string {
        if (this.hasErrors()) {
            return this.messages.map((message) => `${message.message}`).join('\r\n');
        } else {
            return 'No Errors';
        }
    }

}
