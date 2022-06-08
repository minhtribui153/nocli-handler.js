import { NoCliHandlerOptions } from "./types";
declare class NoCliHandler {
    private options;
    constructor(options: NoCliHandlerOptions);
    private main;
    private connectToMongoDB;
}
export default NoCliHandler;
