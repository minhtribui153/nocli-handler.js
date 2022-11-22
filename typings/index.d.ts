export * from './functions/log';
export * from './functions/handle-error';
export * from "./types";
export * from "./command-handler/Command";
export * from "./command-handler/SlashCommands";
export * from "./util/Cooldowns";
export * from "./errors/NoCliCommandError";
export * from "./errors/NoCliHandlerError";
import { Client } from 'discord.js';
import CommandHandler from "./command-handler/CommandHandler";
import EventHandler from './event-handler/EventHandler';
import Cooldowns from './util/Cooldowns';
import { DebugOptions, MongoDBResult, NoCliEmojiOptions, NoCliHandlerOptions, ValidationPluginsOption } from "./types";
import { log } from "./functions/log";
import handleCommandAutocomplete from './functions/handle-command-autocomplete';
import handleError from "./functions/handle-error";
import Command from './command-handler/Command';
/** The base class of nocli-handler.js */
declare class NoCliHandler {
    private _version;
    private _defaultPrefix;
    /** @ts-ignore */
    private _testServers;
    /** @ts-ignore */
    private _botOwners;
    /** @ts-ignore */
    private _disabledDefaultCommands;
    private _mongoDBConnection;
    private _showBanner;
    private _commands;
    private _commandHandler?;
    private _validations?;
    private _eventHandler?;
    /** @ts-ignore */
    private _emojiConfig;
    /** @ts-ignore */
    private _cooldowns;
    /** @ts-ignore */
    private _debugging;
    /** @ts-ignore */
    private _client;
    constructor(options: NoCliHandlerOptions);
    private init;
    get client(): Client<boolean>;
    get testServers(): string[];
    get botOwners(): string[];
    get disabledDefaultCommands(): string[];
    get defaultPrefix(): string;
    get debug(): DebugOptions;
    get commandHandler(): CommandHandler | undefined;
    get eventHandler(): EventHandler | undefined;
    get commands(): Map<string, Command>;
    get emojiConfig(): NoCliEmojiOptions;
    get cooldowns(): Cooldowns;
    get validations(): ValidationPluginsOption | undefined;
    get mongoDBConnection(): MongoDBResult;
    get debugging(): DebugOptions;
    private connectToMongoDB;
}
export { log, handleCommandAutocomplete, handleError, CommandHandler, EventHandler, Cooldowns };
export default NoCliHandler;
