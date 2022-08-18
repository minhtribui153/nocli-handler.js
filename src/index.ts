// <---- EXPORTS ---->
// Functions
export * from './functions/log';
export * from './functions/handle-error';
// Types
export * from "./types";
// Classes
export * from "./command-handler/Command";
export * from "./command-handler/SlashCommands";
export * from "./util/Cooldowns";
// Errors
export * from "./errors/NoCliCommandError";
export * from "./errors/NoCliHandlerError";

// <---- IMPORTS ---->
import DiscordJS, { Client } from 'discord.js';
import CommandHandler from "./command-handler/CommandHandler";
import Cooldowns from './util/Cooldowns';
import NoCliHandlerError from "./errors/NoCliHandlerError";
import mongoose from 'mongoose';

import { NoCliHandlerOptions } from "./types";
import { log } from "./functions/log";
import handleError from "./functions/handle-error";
import showIntroBanner from './functions/show-intro-banner';
import Command from './command-handler/Command';

class NoCliHandler {
    private _version: string = 'v1.0.9';
    private _testServers: string[] = [];
    private _botOwners: string[] = [];
    private _showBanner: boolean = true;
    private _commands: Map<string, Command> = new Map();
    private _cooldowns: Cooldowns;
    private _defaultPrefix: string = "!";
    private _debugging: NoCliHandlerOptions["debugging"];
    private _client: Client;
    
    
    constructor(options: NoCliHandlerOptions) {
        const { client, mongoDB, configuration, cooldownConfig, debugging = {}, botOwners = [], testServers = [], language } = options;
        
        this._client = client;
        this._debugging = debugging;
        this._testServers = testServers;
        this._botOwners = botOwners;
        this._cooldowns = new Cooldowns({
            instance: this,
            errorMessage: cooldownConfig?.defaultErrorMessage,
            botOwnersBypass: cooldownConfig?.botOwnersBypass,
            dbRequired: cooldownConfig?.dbRequired
        })

        if (configuration.defaultPrefix) this._defaultPrefix = configuration.defaultPrefix;
        if (debugging && debugging.showBanner !== undefined) this._showBanner = debugging.showBanner;
        
        try {
            if (this._showBanner) showIntroBanner(this._version)
            if (!language || (language !== "JavaScript" && language !== "TypeScript")) throw new NoCliHandlerError("Invalid language specified");
            if (!client) throw new NoCliHandlerError("No client provided");
            client
                .setMaxListeners(Infinity)
                .on("ready", async client => {
                    log("NoCliHandler", "info", `Your bot ${client.user.tag} is up and running`)
                    if (!botOwners.length) {
                        await client.application.fetch();
                        const { owner } = client.application;

                        if (owner) {
                            // @ts-ignore
                            if (owner.members !== undefined) {
                                // @ts-ignore
                                const owners = owner.members.map(member => member.id);
                                this._botOwners.push(...owners);
                                log("NoCliHandler", "info", `Auto set IDs "${owners.join('", "')}" as default owners`)
                            } else {
                                this._botOwners.push(owner.id);
                                log("NoCliHandler", "info", `Auto set ID "${owner.id}" as a default owner`)
                            }
                        }
                    }
                    if (configuration.commandsDir) {
                        const commandHandlerInstance = new CommandHandler(this, configuration.commandsDir, language);
                        this._commands = commandHandlerInstance.commands;
                    } else log("NoCliHandlerWarning", "warn", "No commands directory provided, you will have to handle the commands yourself");
                    
                    mongoDB !== undefined
                        ? this.connectToMongoDB(mongoDB)
                        : log("NoCliHandlerWarning", "warn", "MongoDB URI not found. Some features will not work!");
                });
        } catch (err) {
            const error = err as any;
            const showFullErrorLog = debugging !== undefined
                ? debugging.showFullErrorLog
                : false;

            handleError(error, showFullErrorLog);
        }
    }
    
    public get client(): NoCliHandlerOptions["client"] { return this._client }
    public get testServers(): string[] { return this._testServers }
    public get botOwners(): string[] { return this._botOwners }
    public get defaultPrefix(): string { return this._defaultPrefix }
    public get debug() { return this._debugging }
    public get commands(): Map<string, Command> | undefined { return this._commands }
    public get cooldowns(): Cooldowns { return this._cooldowns }

    private connectToMongoDB(mongoDB: NoCliHandlerOptions["mongoDB"]) {
        const options = mongoDB!.options;
        mongoose.connect(mongoDB!.uri, options ? options : { keepAlive: true, directConnection: true }, (err) => err
            ? log("NoCliHandlerWarning", "warn", "Error connecting to MongoDB: " + err)
            : log("NoCliHandler", "info", "Connected to MongoDB"));
    }
}
export default NoCliHandler;