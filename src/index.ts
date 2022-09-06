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
import { Client } from 'discord.js';
import CommandHandler from "./command-handler/CommandHandler";
import Cooldowns from './util/Cooldowns';
import NoCliHandlerError from "./errors/NoCliHandlerError";
import mongoose from 'mongoose';

import { DebugOptions, MongoDBConnection, MongoDBResult, NoCliEmojiConfigOptions, NoCliEmojiOptions, NoCliHandlerOptions } from "./types";
import { log } from "./functions/log";
import handleCommandAutocomplete from './functions/handle-command-autocomplete';
import handleError from "./functions/handle-error";
import showIntroBanner from './functions/show-intro-banner';
import Command from './command-handler/Command';

class NoCliHandler {
    private _version: string = 'v1.1.1';
    private _defaultPrefix: string = "!";
    private _testServers: string[];
    private _botOwners: string[];
    private _disabledDefaultCommands: string[];
    private _mongoDBConnection: MongoDBResult = { connected: false, errMessage: "MongoDB URI not found" };
    private _showBanner: boolean = true;
    private _commands: Map<string, Command> = new Map();
    private _commandHandler?: CommandHandler;
    private _emojiConfig: NoCliEmojiOptions;
    private _cooldowns: Cooldowns;
    private _debugging: DebugOptions;
    private _client: Client;
    
    
    constructor(options: NoCliHandlerOptions) {
        const {
            botOwners = [],
            client,
            configuration,
            cooldownConfig,
            debugging = {},
            emojiConfig = {},
            language,
            mongoDB,
            testServers = [],
            disabledDefaultCommands = []
        } = options;

        this._client = client;
        this._debugging = debugging;
        this._testServers = testServers;
        this._emojiConfig = {
            success: emojiConfig.success || "",
            info: emojiConfig.info || "",
            enabled: emojiConfig.enabled || "",
            disabled: emojiConfig.disabled || "",
            error: emojiConfig.error || ""
        };
        this._disabledDefaultCommands = disabledDefaultCommands.map(cmd => cmd.toLowerCase());
        this._botOwners = botOwners;
        this._cooldowns = new Cooldowns({
            instance: this,
            errorMessage: cooldownConfig?.defaultErrorMessage,
            botOwnersBypass: cooldownConfig?.botOwnersBypass,
            dbRequired: cooldownConfig?.dbRequired
        });

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
                        // Fetch
                        await client.application.fetch();
                        await client.guilds.fetch();

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

                    this._mongoDBConnection = await this.connectToMongoDB(mongoDB);

                    this.mongoDBConnection.connected
                        ? log('MongoDBInstance', "info", 'Connected to Database')
                        : log('MongoDBInstance', "warn", this.mongoDBConnection.errMessage!);

                    if (configuration.commandsDir) {
                        this._commandHandler = new CommandHandler(this, configuration.commandsDir, language);
                        this._commands = this._commandHandler.commands;
                    } else log("CommandHandlerWarning", "warn", "No commands directory provided, you will have to handle the commands yourself");
                });
        } catch (err) {
            const error = err as any;
            const showFullErrorLog = debugging !== undefined
                ? debugging.showFullErrorLog
                : false;

            handleError(error, showFullErrorLog);
        }
    }
    
    public get client(): Client { return this._client }
    public get testServers(): string[] { return this._testServers }
    public get botOwners(): string[] { return this._botOwners }
    public get disabledDefaultCommands(): string[] { return this._disabledDefaultCommands }
    public get defaultPrefix(): string { return this._defaultPrefix }
    public get debug(): DebugOptions | undefined { return this._debugging }
    public get commandHandler(): CommandHandler | undefined { return this._commandHandler }
    public get commands(): Map<string, Command> | undefined { return this._commands }
    public get emojiConfig(): NoCliEmojiConfigOptions { return this._emojiConfig }
    public get cooldowns(): Cooldowns { return this._cooldowns }
    public get mongoDBConnection(): MongoDBResult { return this._mongoDBConnection }

    private async connectToMongoDB(mongoDB?: MongoDBConnection): Promise<MongoDBResult> {
        return new Promise((resolve) =>
            mongoDB
                ? mongoose.connect(mongoDB.uri, mongoDB.options ? mongoDB.options : { keepAlive: true, directConnection: true }, (err) => err
                    ? resolve({ connected: false, errMessage: err.message })
                    : resolve({ connected: true }))
                : resolve({ connected: false, errMessage: "MongoDB URI not found" })
        );
    }
}

handleCommandAutocomplete
export { log, handleCommandAutocomplete, handleError }
export default NoCliHandler;