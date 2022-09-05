import { ApplicationCommand, ApplicationCommandOption, CommandInteraction, PermissionResolvable, AutocompleteInteraction, ApplicationCommandOptionData, GuildMember, Client, ClientApplication, Guild, Message, Channel, TextBasedChannel, CommandInteractionOptionResolver } from 'discord.js';
import mongoose, { ConnectOptions } from 'mongoose';
import showBanner from 'node-banner';
import chalk from 'chalk';

// src/index.ts
/**
 * The base class of nocli-handler.js
 */
class NoCliHandler {
    private _version: string = '';
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

    /**
     * 
     * @param options The options for nocli-handler.js
     */
    constructor(options: NoCliHandlerOptions) {}

    public get client(): Client;
    public get testServers(): string[];
    public get botOwners(): string[];
    public get disabledDefaultCommands(): string[];
    public get defaultPrefix(): string;
    public get debug(): DebugOptions | undefined;
    public get commandHandler(): CommandHandler | undefined;
    public get commands(): Map<string, Command> | undefined;
    public get emojiConfig(): NoCliEmojiConfigOptions;
    public get cooldowns(): Cooldowns;
    public get mongoDBConnection(): MongoDBResult;

    private async connectToMongoDB(mongoDB?: MongoDBConnection): Promise<MongoDBResult>;
}

// src/command-handler/ChannelCommands.ts
class ChannelCommands {
    public _channelCommands: Map<string, string[]>;

    public async action(action: "add" | "remove", guildId: string, commandName: string, channelId: string): Promise<string[]>;
    public async add(guildId: string, commandName: string, channelId: string): Promise<string[]>;
    public async remove(guildId: string, commandName: string, channelId: string): Promise<string[]>;
    public async getAvailableChannels(guildId: string, commandName: string): Promise<string[]>;
}

// src/command-handler/Command.ts
export class Command {
    private _commandName: string;
    private _commandObject: ICommand;
    private _instance: NoCliHandler;

    private _isAlias: boolean;
    private _isDefaultCommand: boolean;

    constructor(instance: NoCliHandler, commandName: string, commandObject: ICommand, options?: CommandOptions) {}

    get instance(): NoCliHandler;
    get commandName(): string;
    get commandObject(): ICommand;
    get isAnAlias(): boolean;
    get isDefaultCommand(): boolean;
}

// src/command-handler/CommandHandler.ts
class CommandHandler {
    public commands: Map<string, Command>;
    public commandsDir: string;

    private _suffix: "js" | "ts";
    private _debugging: NoCliHandlerOptions["debugging"];
    private _defaultPrefix: string;
    private _instance: NoCliHandler;
    private _slashCommands: SlashCommands;
    private _channelCommands: ChannelCommands;
    private _customCommands: CustomCommands;
    private _disabledCommands;
    private _validations: Promise<NoCliRuntimeValidationType>[];

    public get channelCommands(): ChannelCommands;
    public get customCommands() { return this._customCommands }
    public get slashCommands() { return this._slashCommands }
    public get disabledCommands() { return this._disabledCommands }

    constructor(instance: NoCliHandler, commandsDir: string, language: NoCliLanguageType) {}

    private getValidations<T>(folder: string): Promise<T>[];
    private async readFiles(): Promise<void>;
    private async runCommand(command: Command, args: string[], message: Message | null, interaction: CommandInteraction | null): Promise<{
        response: string;
        reply: boolean;
        deferReply?: undefined;
    } | {
        response: any;
        deferReply: boolean | "ephemeral";
        reply: boolean;
    } | undefined>;
    /** Handles autocomplete interaction */
    private async handleAutocomplete(interaction: AutocompleteInteraction): Promise<void>;
    private async messageListener(client: Client): Promise<void>;
    private async interactionListener(client: Client): Promise<void>;
}

// src/command-handler/CustomCommands.ts
class CustomCommands {
    private _customCommands: Map<string, string>;
    private _commandHandler: CommandHandler;

    constructor(commandHandler: CommandHandler) {}

    // guildId-commandName: response
    get commands(): Map<string, string>;

    async loadCommands(): Promise<void>;
    async create(guildId: string, commandName: string, description: string, response: string): Promise<void>;
    async delete(guildId: string, commandName: string): Promise<void>;
    async run(commandName: string, message?: Message, interaction?: CommandInteraction): Promise<void>;
}

// src/command-handler/DisabledCommands.ts
class DisabledCommands {
    // array of `${guildId}-${commandName}`
    private _disabledCommands: string[];

    constructor() {}

    async loadDisabledCommands(): Promise<void>;
    async disable(guildId: string, commandName: string): Promise<void>;
    async enable(guildId: string, commandName: string): Promise<void>;
    isDisabled(guildId: string, commandName: string): boolean;
}

// src/command-handler/SlashCommands.ts
export class SlashCommands {
    private _client: Client;
    private _showFullErrorLog: boolean | undefined;

    constructor(client: Client, showFullErrorLog: boolean | undefined) {}
    
    /**
     * Gets the Slash commands based on the guild ID.
     * @param guildId The guild id (optional)
     */
    async getCommands(guildId?: string | null): Promise<ApplicationCommandManager | GuildApplicationCommandManager>;

    async findCommand(commandId: string, guildId?: string): Promise<ApplicationCommand<{}> | undefined>;

    /**
     * Checks if the new slash command option and the old one are different
     * @param {ApplicationCommandOption[]} existingOptions The current slash command options.
     * @param {ApplicationCommandOptionData[]} options The new slash command options.
     */
    optionsAreDifferent(existingOptions: ApplicationCommandOption[], options: ApplicationCommandOptionData[]): boolean;

    /**
     * Creates a new Slash Command
     * @param {string} name The name of the command
     * @param {string} description The description of the command
     * @param {ApplicationCommandOptionData[]} options The command options
     * @param {string?} guildId The guild ID (optional)
     */
    async create(name: string, description: string, options: ApplicationCommandOptionData[] = [], guildId?: string): Promise<ApplicationCommand<{}> | undefined>;

    /**
     * Deletes a Slash Command
     * @param commandName The name of the command
     * @param guildId  The guild ID (optional)
     */
    async delete(commandName: string, guildId: string = ''): Promise<void>;

    /**
     * Creates options for a Slash Command
     * @param param0 The ICommand Interface
     * @returns {ApplicationCommandOptionData[]}
     */
    createOptions({ expectedArgs = '', minArgs = 0, expectedArgsTypes = [] }: ICommand): ApplicationCommandOptionData[];
}

// src/NoCliCommandError.ts
class NoCliCommandError extends NoCliHandlerError {
    name = "NoCliCommandError";
    constructor(msg: string) {}
}

// src/NoCliHandlerError.ts
class NoCliHandlerError extends Error {
    name = "NoCliHandlerError";
    constructor(msg: string) {}
}

// src/functions/handle-command-autocomplete.ts
export const handleCommandAutocomplete = (commands: Map<string, Command>, guildId?: string | null | undefined, defaultCommands: boolean = false): string[] => {};

// src/functions/handle-error.ts
export default (error: any, showFullErrorLog: boolean | undefined, command?: string): never => {}

// src/functions/log.ts
export type NoCliLogType = 'info' | 'warn' | 'error';

type NoCliLogColorType = "red" | "blue" | "yellow";

const handleColorType = (type: NoCliLogType): NoCliLogColorType => {};
export const log = (name: string, type: NoCliLogType, ...args: string[]) => {};

// src/functions/show-intro-banner.ts
const showIntroBanner = (version: string): void => {};

// src/types/index.ts

// Arrays
export const cooldownTypesArray = ['perUser', 'perUserPerGuild', 'perGuild', 'global'] as const;

// NoCliHandler Reference:
export type NoCliHandlerOptions = {
    /** The Discord.JS Client you initialized */
    client: Client;
    /** Connects to MongoDB */
    mongoDB?: MongoDBConnection;
    /** The Bot Configuration */
    configuration: ConfigOptions;
    /** The Environment Configuration */
    debugging?: DebugOptions;
    /** The options for cooldowns */
    cooldownConfig?: NoCliCooldownConfigOptions;
    /** Sets the default emojis for messages sent from the command handler */
    emojiConfig?: NoCliEmojiConfigOptions;
    /** The test guilds `testonly` commands can only work in  */
    testServers?: string[];
    /** The array of Discord ID of bot owners */
    botOwners?: string[];
    /** The default commands from the command handler to disable when the bot starts */
    disabledDefaultCommands?: string[];
    /** The language you are using to develop your Discord.JS Bot  */
    language: NoCliLanguageType;
}

export type NoCliCooldownOptions = {
    instance: NoCliHandler;
    errorMessage?: string;
    botOwnersBypass?: boolean;
    dbRequired?: number;
}


// NoCliHandler Options Reference
export type NoCliCooldownConfigOptions = {
    /** Sets the default error message for cooldowns, if any */
    defaultErrorMessage?: string;
    /** Whether to allow bot owners to bypass cooldowns */
    botOwnersBypass?: boolean;
    /** If a command cooldown exceeds the current cooldown limit set for this option, they will be stored in a MongoDB database  */
    dbRequired?: number;
}

export type MongoDBConnection = {
    /** The MongoDB URI */
    uri: string;
    /** The MongoDB options (optional) */
    options?: ConnectOptions;
}

export type MongoDBResult = {
    connected: boolean;
    errMessage?: any;
}

export type DebugOptions = {
    /** Whether or not to show the full error log */
    showFullErrorLog?: boolean;
    /** Whether or not to show the banner upon the start of the program  */
    showBanner?: boolean;
}

export type ConfigOptions = {
    /** The default prefix for the bot (default prefix = "!") */
    defaultPrefix?: string;
    /** The directory where the commands are stored */
    commandsDir?: string;
    /** The directory where the features are stored */
    featuresDir?: string;
}

export type NoCliCooldownKeyOptions = {
    cooldownType: NoCliCooldownType;
    userId: string;
    actionId: string;
    guildId?: string;
    duration?: string | number;
    errorMessage?: string;
}

export type NoCliEmojiConfigOptions = {
    success?: string;
    error?: string;
    info?: string;
    enabled?: string;
    disabled?: string;
}

export type NoCliEmojiOptions = {
    success: string;
    error: string;
    info: string;
    enabled: string;
    disabled: string;
}

export type NoCliRuntimeValidationType = (command: Command, usage: CommandCallbackOptions, prefix: string) => boolean;
export type NoCliSyntaxValidationType = (command: Command) => void;

export type NoCliEnvironmentType = "PRODUCTION" | "DEVELOPMENT" | "TESTING";
export type NoCliLanguageType = "TypeScript" | "JavaScript";
export type NoCliCooldownType = typeof cooldownTypesArray[number];

// Command Reference:
export interface ICommand {
    /** Sets the command type */
    type: NoCliCommandType | NoCliCommandTypeString;
    /** Tells the command handler whether to disable this command from interaction with the guilds */
    delete?: boolean;
    /** Runs events inside a command */
    init?: (client: Client, instance: NoCliHandler) => void;
    /** Handles autocomplete interaction for a Slash command */
    autocomplete?: (interaction: AutocompleteInteraction, command: Command, args: string) => string[] | Promise<string[]>;
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
    /** The correct syntax on how the arguments should be in place. */
    expectedArgs?: string;
    /** Defines the Slash Command option property for expectedArgs */
    expectedArgsTypes?: ApplicationCommandOptionType[];
    /** The array of permissions the user that ran this command needs */
    permissions?: PermissionResolvable[];
    /** Whether the command is for test guilds  */
    testOnly?: boolean;
    /** Whether the command only works only in guilds  */
    guildOnly?: boolean;
    /** Whether the command is only allowed for bot owners  */
    ownerOnly?: boolean;
    /** Tells the command handler whether to defer command reply */
    deferReply?: boolean | "ephemeral";
    /** Tells the command handler whether to tell the bot to reply or send channel message (only works for Legacy Commands) */
    reply?: boolean;
    /** The command cooldowns */
    cooldowns?: NoCliCommandCooldown;
    /** 
     * The Discord.JS arguments (only works for Slash Commands)
     * Specify this if you are used to handle Discord.JS arguments with Slash Commands.
     */
    options?: ApplicationCommandOptionData[];
    /** The function to execute when the command is called */
    callback: (options: CommandCallbackOptions) => any;
    /** Short-form commands */
    aliases?: string[];
}

export type CommandOptions = {
    isAlias?: boolean;
    isDefaultCommand?: boolean;
}

export type CommandCallbackOptions = {
    /** The NoCliHandler Instance */
    instance: NoCliHandler;
    /** The Discord.JS Client Instance */
    client: Client;
    /** The Discord.JS Message Instance */
    message: Message | null;
    /** The Discord.JS CommandInteraction Instance  */
    interaction: CommandInteraction | null;
    /** The Discord.JS CommandInteractionOptionResolber Instance */
    options: CommandInteractionOptionResolver | null;
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
    /** The text channel the command was ran from */
    channel: Channel | TextBasedChannel | null;
    /** Cancels the cooldown for this command */
    cancelCooldown: () => void;
    /** Updates the cooldown for this command */
    updateCooldown: (expires: Date) => void;
}

export type NoCliCommandCooldown = {
    /** Sets cooldowns for each user */
    perUser?: string | number;
    /** Sets cooldowns for each user per guild */
    perUserPerGuild?: string | number;
    /** Sets cooldowns for each guild */
    perGuild?: string | number;
    /** Sets cooldowns for every server the user was in */
    global?: string | number;
    /** The cooldown message to send, if any */
    errorMessage?: string;
}

export enum NoCliCommandType {
    Slash = 0,
    Legacy = 1,
    Both = 2
};

export const NoCliCommandTypeArray = Object.keys(NoCliCommandType);

export type NoCliCommandTypeString = keyof typeof NoCliCommandType;

// src/util/Cooldowns.ts
const cooldownDurations = {
    s: 1,
    m: 60,
    h: 60 * 60,
    d: 60 * 60 * 24
} as const;

/** Sets cooldowns for the database and the bot */
export class Cooldowns {
    private _cooldowns: Map<string, Date>;
    private _instance: NoCliHandler;
    private _errorMessage: string
    private _botOwnersBypass: boolean;
    private _dbRequired: number;


    constructor(options: NoCliCooldownOptions) {}

    /** Loads all cooldowns from the database */
    async loadCooldowns() {}

    getKeyFromCooldownUsage(options: NoCliCooldownKeyOptions): string {}

    async cancelCooldown(cooldownUsage: NoCliCooldownKeyOptions) {}

    async updateCooldown(cooldownUsage: NoCliCooldownKeyOptions, expires: Date) {}

    /** Verifies the cooldown duration */
    verifyCooldown(duration: string | number): number {}

    /** Gets the cooldown key */
    getKey(cooldownType: NoCliCooldownType, userId?: string, actionId?: string, guildId?: string): string {}

    /** Checks if user can bypass cooldown integrations */
    canBypass(userId: string): boolean {}

    /** Starts the cooldown */
    async start(options: NoCliCooldownKeyOptions) {}

    canRunAction(options: NoCliCooldownKeyOptions): string | true {}
}

// src/util/get-all-files.ts
function getAllFiles(path: string): string[];

// src/util/import-file.ts
const importFile = <T>(filePath: string): T => {}

export default NoCliHandler;