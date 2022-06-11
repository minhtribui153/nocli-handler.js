import NoCliHandlerError from "./NoCliHandlerError";
declare class NoCliCommandError extends NoCliHandlerError {
    name: string;
    constructor(msg: string);
}
export default NoCliCommandError;
