export * from './functions/log';
export * from "./types";
import { NoCliHandlerOptions } from "./types";
declare class NoCliHandler {
    private _options;
    private _version;
    private _testServers;
    private _configuration;
    private _language;
    private _debugging;
    private _showBanner;
    private _defaultPrefix;
    constructor(options: NoCliHandlerOptions);
    get client(): NoCliHandlerOptions["client"];
    get testServers(): string[];
    get defaultPrefix(): string;
    get debug(): {
        showFullErrorLog?: boolean | undefined;
        showBanner?: boolean | undefined;
    } | undefined;
    private main;
    private connectToMongoDB;
}
export default NoCliHandler;
