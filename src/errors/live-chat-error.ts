export class LiveChatError extends Error {

    private stackTrace: string = null;

    constructor(
        public code: string,
        public detailedMessage: string,
    ) {
        super(detailedMessage);
    }

    public setStackTrace(stackTrace: string): LiveChatError {
        this.stackTrace = stackTrace;

        return this;
    }

    public static fromError(err: any | Error): LiveChatError {
        if (!err.detailedMessage) {
            return new LiveChatError('system_error', err.message).setStackTrace(err.stack);
        }

        return err;
    }
}
