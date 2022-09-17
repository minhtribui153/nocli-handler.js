import NoCliHandlerError from "./NoCliHandlerError";

class NoCliEventError extends NoCliHandlerError {
    name = "NoCliEventError";
    constructor(msg: string) {
        super(msg);
    }
}

export default NoCliEventError;