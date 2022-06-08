import NoCliHandlerError from "./NoCliHandlerError";

class NoCliCommandError extends NoCliHandlerError {
    name = "NoCliCommandError";
    constructor(msg: string) {
        super(msg);
    }
}

export default NoCliCommandError;
