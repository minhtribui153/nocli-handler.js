import { NoCliHandlerOptions } from "./types";
declare class NoCliHandler {
    private _options;
    private _version;
    private _configuration;
    private _language;
    private _debugging;
    private _defaultPrefix;
    constructor(options: NoCliHandlerOptions);
    get client(): NoCliHandlerOptions["client"];
    private main;
    private connectToMongoDB;
}
export default NoCliHandler;
