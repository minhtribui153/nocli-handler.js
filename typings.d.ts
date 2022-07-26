import { ApplicationCommand, ApplicationCommandOption, ApplicationCommandOptionData, GuildMember, Client, ClientApplication, Guild, Message, Channel, TextBasedChannel } from 'discord.js';
import mongoose, { ConnectOptions } from 'mongoose';
import showBanner from 'node-banner';
import chalk from 'chalk';

// src/index.ts
/**
 * The base class of nocli-handler.js
 */
class NoCliHandler {
    private _options: NoCliHandlerOptions;
    private _version: string = 'Version: v1.0.33';
    private _testServers: string[] = [];
    private _configuration: NoCliHandlerOptions["configuration"];
    private _language: NoCliHandlerOptions["language"];
    private _debugging: NoCliHandlerOptions["debugging"];
    private _showBanner: boolean = true;
    private _defaultPrefix: string = "!";
    private _commands: Map<string, Command> = new Map();

    /**
     * 
     * @param options The options for nocli-handler.js
     */
    constructor(options: NoCliHandlerOptions) {}

    public get client(): NoCliHandlerOptions["client"];
    public get testServers(): string[];
    public get defaultPrefix(): string;
    public get debug();
    public get commands(): Map<string, Command>;

    private connectToMongoDB(mongoDB: NoCliHandlerOptions["mongoDB"]);
}

// src/command-handler/Command.ts
export class Command {
    private _commandName: string;
    private _commandObject: ICommand;
    private _instance: NoCliHandler;

    constructor(instance: NoCliHandler, commandName: string, commandObject: ICommand) {}

    get instance(): NoCliHandler;
    get commandName(): string;
    get commandObject(): ICommand;
}

// src/command-handler/CommandHandler.ts
class CommandHandler {
    public commands: Map<string, Command> = new Map();
    public commandsDir: string;

    private _suffix: "js" | "ts";
    private _debugging: NoCliHandlerOptions["debugging"];
    private _defaultPrefix: string;
    private _instance: NoCliHandler;
    private _slashCommands: SlashCommands;
    private _validations

    constructor(instance: NoCliHandler, commandsDir: string, language: NoCliLanguageType) {}

    private async readFiles();

    async importFile<T>(filePath: string): Promise<T>;
    async getValidations<T>(folder: string): Promise<T>[];
    private async messageListener(client: Client);
    private async interactionListener(client: Client);
}

// src/command-handler/SlashCommands.ts
export class SlashCommands {
    private _client: Client;
    constructor(client: Client) {}
    /**
     * Gets the Slash commands based on the guild ID.
     * @param guildId The guild id (optional)
     */
    getCommands(guildId?: string): ClientApplication["commands"];

    /**
     * Checks if the new slash command option and the old one are different
     * @param {ApplicationCommandOption[]} existingOptions The current slash command options.
     * @param {ApplicationCommandOptionData[]} options The new slash command options.
     */
    optionsAreDifferent(existingOptions: ApplicationCommandOption[], options: ApplicationCommandOptionData[]): boolean

    /**
     * Creates a new Slash Command
     * @param {string}  name The name of the command
     * @param {string} description The description of the command
     * @param {ApplicationCommandOptionData[]} options The command options
     * @param {string?} guildId The guild ID (optional)
     */
     async create(name: string, description: string, options: ApplicationCommandOptionData[], guildId?: string): Promise<ApplicationCommand<{}> | undefined>;

    /** Creates command options from expectedArgs */
    createOptions({ expectedArgs = '', minArgs = 0 }: ICommand): ApplicationCommandOptionData[];
}

// src/NoCliCommandError.ts
export class NoCliHandlerError extends Error {
    constructor(msg: string) {}
}

// src/NoCliHandlerError.ts
export class NoCliHandlerError extends Error {
    constructor(msg: string) {}
}

// src/functions/handle-error.ts
export const handleError = (error: any, showFullErrorLog: boolean | undefined): never => {};


// src/functions/is-correct-version.ts
const isCorrectVersion = (version: string): boolean => {};

// src/functions/log.ts
export type NoCliLogType = 'info' | 'warn' | 'error';

type NoCliLogColorType = "red" | "blue" | "yellow";

export type ICommandOptionType =
| "STRING"
| "INTEGER"
| "BOOLEAN"
| "USER"
| "CHANNEL"
| "ROLE"
| "MENTIONABLE"
| "NUMBER"
| "ATTACHMENT"

const handleColorType = (type: NoCliLogType): NoCliLogColorType => {};
export const log = (name: string, type: NoCliLogType, ...args: string[]) => {};

// src/functions/show-intro-banner.ts
const showIntroBanner = (version: string): void => {};

// src/types/index.ts
import { Client, CommandInteraction, Guild, Message } from "discord.js";
import { ConnectOptions } from "mongoose";
import Command from "../command-handler/Command";

// NoCliHandler Reference:
export type NoCliHandlerOptions = {
    /** The Discord.JS Client you initialized */
    client: Client;
    /** Connects to MongoDB */
    mongoDB?: {
        /** The MongoDB URI */
        uri: string;
        /** The MongoDB options (optional) */
        options?: ConnectOptions;
    }
    /** The Bot Configuration */
    configuration: {
        /** The default prefix for the bot (default prefix = "!") */
        defaultPrefix?: string;
        /** The directory where the commands are stored */
        commandsDir?: string;
        /** The directory where the features are stored */
        featuresDir?: string;
        /** The array of Discord ID of bot owners */
        botOwners?: string[];
    };
    /** The Environment Configuration  */
    debugging?: {
        /** Whether or not to show the full error log */
        showFullErrorLog?: boolean;
        /** Whether or not to show the banner upon the start of the program  */
        showBanner?: boolean;
    };
    /** The test guilds testonly commands can only work in  */
    testServers?: string[];
    /** The array of Discord ID of bot owners */
    botOwners?: string[];
    /** The language you are using to develop your Discord.JS Bot  */
    language: NoCliLanguageType;
    /**
     * Your Discord.JS Client Version.
     * Pass the version of your Discord.JS Client like this:
     * #### TypeScript
     * ```typescript
     * import DiscordJS from 'discord.js';
     * ...
     * clientVersion: DiscordJS.version,
     * ...
     * ```
     * 
     * #### JavaScript
     * ```javascript
     * const DiscordJS = require('discord.js');
     * ...
     * clientVersion: DiscordJS.version,
     * ...
     * ```
     */
    clientVersion: string;
}
export type NoCliRuntimeValidationType = (command: Command, usage: CommandCallbackOptions, prefix: string) => boolean;
export type NoCliSyntaxValidationType = (command: Command) => void;

export type NoCliEnvironmentType = "PRODUCTION" | "DEVELOPMENT" | "TESTING";
export type NoCliLanguageType = "TypeScript" | "JavaScript";

// Command Reference:
export interface ICommand {
    /** Sets the command type */
    type: NoCliCommandType;
    /** Tells the command handler whether to disable this command from interaction with the guilds */
    delete?: boolean;
    /** Runs events inside a command */
    init?: (client: Client, instance: NoCliHandler) => void;
    /** The description of the command */
    description: string;
    /** The minimum amount of arguments for the command */
    minArgs?: number;
    /** The maximum amount of arguments for the command */
    maxArgs?: number;
    /** 
     * Sends a message specified in correctSyntax if arguments validation failed.
     * 
     * **Annotations:**
     * ```
     * "[PREFIX]" - "The prefix of the command to show"
     * "[ARGS]" - "The arguments of the command to show"
     * ```
     */
    correctSyntax?: string;
    /**
     * The expected arguments that should be in place.
     * 
     * **Annotations:**
     * ```
     * <argument_name> = Required Argument
     * [argument_name] = Optional Argument
     * ```
     * **IMPORTANT: If you do not specify minArgs, these arguments will be displayed as optional for the Slash Command.**
     * **However, you still have to specify these annotations as it is required and can help you understand what your arguments are supposed to be.**
     */
    expectedArgs?: string;
    /** Defines the Slash Command option property for each argument in expectedArgs */
    expectedArgsTypes?: ApplicationCommandNonOptionsData[];
    /** Whether the command is for test guilds or not  */
    testOnly?: boolean;
    /** Whether the command only works only in guilds  */
    guildOnly?: boolean;
    /** Whether the command is only allowed for bot owners  */
    ownerOnly?: boolean;
    /** Tells the command handler whether to delay interaction reply when any value is returned from the command */
    deferReply?: boolean;
    /** 
     * Tells the command handler whether to make interaction reply ephemeral when any value is returned from the command.
     * 
     * **IMPORTANT: This option will only be ignored if you return a value as an `Object` for a normal interaction reply**
    */
    ephemeralReply?: boolean;
    /** 
     * The Discord.JS arguments (only works for Slash Commands).
     * Specify this if you are used to handle Discord.JS arguments with Slash Commands.
     * Don't worry, your expectedArgs will not be used.
     */
    options?: ApplicationCommandOptionData[];
    /** The function to execute when the command is called */
    callback: (options: CommandCallbackOptions) => any;
    /** Short-form commands */
    aliases?: string[];
}

export type CommandCallbackOptions = {
    /** The Discord.JS Client Instance */
    client: Client;
    /** The Discord.JS Message Instance */
    message: Message | null;
    /** The Discord.JS CommandInteraction Instance  */
    interaction: CommandInteraction | null;
    /** The arguments passed to the command */
    args: string[];
    /** The arguments combined into a string */
    text: string;
    /** The guild the command was ran from  */
    guild: Guild | null;
    /** The guild member who ran this command */
    member: GuildMember | null;
    /** The user who ran this command */
    user: User;
    /** The channel the command was ran from */
    channel: Channel | TextBasedChannel | null;
}

export type NoCliCommandType = "SLASH" | "LEGACY" | "BOTH";

// src/util/get-all-files.ts
function getAllFiles(path: string): string[];

// src/util/import-file.ts


export default NoCliHandler;