// <---- EXPORTS ---->
// Functions
export * from './functions/log';
export * from './functions/handle-error';
// Types
export * from "./types";
// Classes
export * from "./command-handler/Command";
export * from "./command-handler/SlashCommands";
// Errors
export * from "./errors/NoCliCommandError";
export * from "./errors/NoCliHandlerError";

// <---- IMPORTS ---->
import DiscordJS from 'discord.js';
import CommandHandler from "./command-handler/CommandHandler";
import NoCliHandlerError from "./errors/NoCliHandlerError";
import mongoose from 'mongoose';

import { NoCliHandlerOptions } from "./types";
import { log } from "./functions/log";
import handleError from "./functions/handle-error";
import showIntroBanner from './functions/show-intro-banner';
import isCorrectVersion from './functions/is-correct-version';
import Command from './command-handler/Command';

class NoCliHandler {
    private _options: NoCliHandlerOptions;
    private _version: string = 'v1.0.33';
    private _testServers: string[] = [];
    private _botOwners: string[] = [];
    private _configuration: NoCliHandlerOptions["configuration"];
    private _language: NoCliHandlerOptions["language"];
    private _debugging: NoCliHandlerOptions["debugging"];
    private _clientVersion: string;
    private _showBanner: boolean = true;
    private _commands: Map<string, Command> = new Map();
    private _defaultPrefix: string = "!";
    
    
    constructor(options: NoCliHandlerOptions) {
        this._options = options;
        this._configuration = options.configuration;
        this._debugging = options.debugging;
        this._language = options.language;
        this._clientVersion = options.clientVersion;

        if (this._options.testServers) this._testServers = this._options.testServers;
        if (this._options.botOwners) this._botOwners = this._options.botOwners;
        if (this._configuration.defaultPrefix) this._defaultPrefix = this._configuration.defaultPrefix;
        if (this._debugging && this._debugging.showBanner !== undefined) this._showBanner = this._debugging.showBanner;
        
        try {
            if (this._showBanner) showIntroBanner(this._version)
            if (!this._clientVersion) throw new NoCliHandlerError("Client version is required");
            if (!isCorrectVersion(this._clientVersion)) throw new NoCliHandlerError("Please install Discord.JS version " + DiscordJS.version);
            if (!this._language || (this._language !== "JavaScript" && this._language !== "TypeScript")) throw new NoCliHandlerError("Invalid language specified");
            if (!this._options.client) throw new NoCliHandlerError("No client provided");
            this._options.client
                .setMaxListeners(Infinity)
                .on("ready", client => {
                    log("NoCliHandler", "info", `Your bot ${client.user.tag} is up and running`)
                    if (this._configuration.commandsDir) {
                        const commandHandlerInstance = new CommandHandler(this, this._configuration.commandsDir, this._language);
                        this._commands = commandHandlerInstance.commands;
                    } else log("NoCliHandlerWarning", "warn", "E1: No commands directory provided, you will have to handle the commands yourself");
                    
                    this._options.mongoDB !== undefined
                        ? this.connectToMongoDB(this._options.mongoDB)
                        : log("NoCliHandlerWarning", "warn", "-");
                });
        } catch (err) {
            const error = err as any;
            const showFullErrorLog = this._debugging !== undefined
                ? this._debugging.showFullErrorLog
                : false;

            handleError(error, showFullErrorLog);
        }
    }
    
    public get client(): NoCliHandlerOptions["client"] { return this._options.client }
    public get testServers(): string[] { return this._testServers }
    public get botOwners(): string[] { return this._botOwners }
    public get defaultPrefix(): string { return this._defaultPrefix }
    public get debug() { return this._debugging }
    public get commands(): Map<string, Command> | undefined { return this._commands }

    private connectToMongoDB(mongoDB: NoCliHandlerOptions["mongoDB"]) {
        const options = mongoDB!.options;
        mongoose.connect(mongoDB!.uri, options ? options : { keepAlive: true }, (err) => err
            ? log("NoCliHandlerWarning", "warn", "Error connecting to MongoDB: " + err)
            : log("NoCliHandler", "info", "Connected to MongoDB"));
    }
}
export default NoCliHandler;