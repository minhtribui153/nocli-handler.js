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
import EventHandler from './event-handler/EventHandler';
import Cooldowns from './util/Cooldowns';
import NoCliHandlerError from "./errors/NoCliHandlerError";
import mongoose from 'mongoose';

import { DebugOptions, MongoDBConnection, MongoDBResult, NoCliEmojiConfigOptions, NoCliEmojiOptions, NoCliHandlerOptions, ValidationPluginsOption } from "./types";
import { log } from "./functions/log";
import handleCommandAutocomplete from './functions/handle-command-autocomplete';
import handleError from "./functions/handle-error";
import showIntroBanner from './functions/show-intro-banner';
import Command from './command-handler/Command';
import FeatureHandler from './util/FeatureHandler';

/** The base class of nocli-handler.js */
class NoCliHandler {
    private _version: string = 'v1.1.3';
    private _defaultPrefix: string = "!";
    /** @ts-ignore */
    private _testServers: string[];
    /** @ts-ignore */
    private _botOwners: string[];
    /** @ts-ignore */
    private _disabledDefaultCommands: string[];
    private _mongoDBConnection: MongoDBResult = { connected: false, errMessage: "MongoDB URI not found" };
    private _showBanner: boolean = true;
    private _commands: Map<string, Command> = new Map();
    private _commandHandler?: CommandHandler;
    private _validations?: ValidationPluginsOption;
    private _eventHandler?: EventHandler;
    /** @ts-ignore */
    private _emojiConfig: NoCliEmojiOptions;
    /** @ts-ignore */
    private _cooldowns: Cooldowns;
    /** @ts-ignore */
    private _debugging: DebugOptions;
    /** @ts-ignore */
    private _client: Client;
    
    
    constructor(options: NoCliHandlerOptions) {
        this.init(options);
    }

    private async init({
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
    }: NoCliHandlerOptions) {

        this._client = client;
        this._debugging = debugging;
        this._testServers = testServers;
        this._validations = configuration.validations;
        this._disabledDefaultCommands = disabledDefaultCommands.map(cmd => cmd.toLowerCase());
        this._botOwners = botOwners;
        this._emojiConfig = {
            success: emojiConfig.success || "",
            info: emojiConfig.info || "",
            enabled: emojiConfig.enabled || "",
            disabled: emojiConfig.disabled || "",
            error: emojiConfig.error || ""
        };
        this._cooldowns = new Cooldowns({
            instance: this,
            errorMessage: cooldownConfig?.defaultErrorMessage,
            botOwnersBypass: cooldownConfig?.botOwnersBypass,
            dbRequired: cooldownConfig?.dbRequired
        });

        if (configuration.defaultPrefix) this._defaultPrefix = configuration.defaultPrefix;
        if (debugging && debugging.showBanner !== undefined) this._showBanner = debugging.showBanner;
        
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

                try {
                    this._mongoDBConnection = await this.connectToMongoDB(mongoDB);
                    this._mongoDBConnection.connected
                        ? log('MongoDBInstance', "info", 'Connected to Database')
                        : log('MongoDBInstance', "warn", this.mongoDBConnection.errMessage!);
        
                    if (configuration.commandsDir) {
                        this._commandHandler = new CommandHandler(this, configuration.commandsDir, language);
                        this._commands = this._commandHandler.commands;
                    } else log("CommandHandlerWarning", "warn", "No commands directory provided, you will have to handle commands yourself");
        
                    if (configuration.featuresDir) new FeatureHandler(this, configuration.featuresDir, client, language);
        
                    this._eventHandler = new EventHandler(this, client, language, configuration.events);
                } catch (err) {
                    const error = err as any;
                    const showFullErrorLog = debugging !== undefined ? debugging.showFullErrorLog : false;
                    handleError(error, showFullErrorLog);
                }
            });
    }
    
    public get client() { return this._client }
    public get testServers() { return this._testServers }
    public get botOwners() { return this._botOwners }
    public get disabledDefaultCommands() { return this._disabledDefaultCommands }
    public get defaultPrefix() { return this._defaultPrefix }
    public get debug() { return this._debugging }
    public get commandHandler() { return this._commandHandler }
    public get eventHandler() { return this._eventHandler }
    public get commands() { return this._commands }
    public get emojiConfig() { return this._emojiConfig }
    public get cooldowns() { return this._cooldowns }
    public get validations() { return this._validations }
    public get mongoDBConnection() { return this._mongoDBConnection }
    public get debugging() { return this._debugging }

    private async connectToMongoDB(mongoDB?: MongoDBConnection): Promise<MongoDBResult> {
        return new Promise((resolve) =>
            mongoDB
                ? mongoose.connect(mongoDB.uri, mongoDB.options ? mongoDB.options : { keepAlive: true, directConnection: true }, (err) => err
                    ? resolve({ connected: false, errMessage: err.message })
                    : resolve({ connected: true }))
                : resolve({ connected: false, errMessage: "MongoDB URI not found, some features will not work!" })
        );
    }
}

handleCommandAutocomplete
export { log, handleCommandAutocomplete, handleError, CommandHandler, EventHandler, Cooldowns }
export default NoCliHandler;