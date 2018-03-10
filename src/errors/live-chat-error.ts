export class LiveChatError extends Error {
    constructor(
        public code: string,
        public detailedMessage: string,
    ) {
        super(detailedMessage);
    }

    public static fromError(err: any | Error): LiveChatError {
        if (!err.detailedMessage) {
            return new LiveChatError('system_error', err.message);
        }

        return err;
    }
}
