declare class NoCliHandlerError extends Error {
    name: string;
    constructor(msg: string);
}
export default NoCliHandlerError;
