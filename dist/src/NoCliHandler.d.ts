import { NoCliHandlerOptions } from "./types";
declare class NoCliHandler {
    options: NoCliHandlerOptions;
    constructor(options: NoCliHandlerOptions);
    private main;
    private connectToMongoDB;
}
export default NoCliHandler;
