import CommandHandler from "./command-handler/CommandHandler";
import NoCliHandlerError from "./errors/NoCliHandlerError";
import mongoose from 'mongoose';
import showBanner from 'node-banner';

import { NoCliHandlerOptions } from "./types";
import { log } from "./functions/log";
import handleError from "./functions/handleError";

class NoCliHandler {
    private _options: NoCliHandlerOptions;
    private _version: string = '1.0.3';
    private _configuration: NoCliHandlerOptions["configuration"];
    private _language: NoCliHandlerOptions["language"];
    private _debugging: NoCliHandlerOptions["debugging"];
    private _defaultPrefix: string = "!";
    
    
    constructor(options: NoCliHandlerOptions) {
        this._options = options;
        this._configuration = options.configuration;
        this._debugging = options.debugging;
        this._language = options.language;
        if (this._configuration.defaultPrefix) this._defaultPrefix = this._configuration.defaultPrefix;
        
        this.main();
    }
    
    public get client(): NoCliHandlerOptions["client"] { return this._options.client }

    private async main() {
        try {
            const showbanner = this._debugging !== undefined
                ? this._debugging.showBanner !== undefined
                    ? true
                    : false
                : false
            if (showbanner) {
                console.clear()
                await showBanner("NoCliHandler.JS", this._version, "green", "red");
            }
            if (!this._language || (this._language !== "JavaScript" && this._language !== "TypeScript")) throw new NoCliHandlerError("Invalid language specified");
            if (!this._options.client) throw new NoCliHandlerError("No client provided");
            this._options.client
                .setMaxListeners(Infinity)
                .on("ready", bot => log("NoCliHandler", "info", `Your bot ${bot.user.tag} is up and running`));

            if (this._configuration.commandsDir) {
                const commandHandlerInstance = new CommandHandler(this._configuration.commandsDir, this._language, this._debugging, this._defaultPrefix);
                commandHandlerInstance.messageListener(this._options.client);
            } else log("NoCliHandler", "warn", "No commands directory provided, you will have to handle the commands yourself");
            
            this._options.mongoDB !== undefined
                ? this.connectToMongoDB(this._options.mongoDB)
                : log("NoCliHandler", "warn", "No mongoURI provided");
        } catch (err) {
            const error = err as any;
            const showFullErrorLog = this._debugging !== undefined
                ? this._debugging.showFullErrorLog
                : false;

            handleError(error, showFullErrorLog);
        }
    }
    private connectToMongoDB(mongoDB: NoCliHandlerOptions["mongoDB"]) {
        const options = mongoDB!.options;
        mongoose.connect(mongoDB!.uri, options ? options : { keepAlive: true }, (err) => err
            ? log("NoCliHandler", "warn", "Error connecting to MongoDB: " + err)
            : log("NoCliHandler", "info", "Connected to MongoDB"));
    }
}
export default NoCliHandler;