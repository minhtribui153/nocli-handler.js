import NoCliHandlerError from "./NoCliHandlerError";
declare class NoCliEventError extends NoCliHandlerError {
    name: string;
    constructor(msg: string);
}
export default NoCliEventError;
