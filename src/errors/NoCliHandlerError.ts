class NoCliHandlerError extends Error {
    name = "NoCliHandlerError";
    constructor(msg: string) {
        super(msg);
        Object.setPrototypeOf(this, NoCliHandlerError.prototype);
    }
}

export default NoCliHandlerError;