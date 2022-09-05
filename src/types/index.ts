import { Channel, ApplicationCommandOptionData, Client, CommandInteraction, Guild, GuildMember, Message, TextBasedChannel, User, ApplicationCommandOptionType, AutocompleteInteraction, PermissionResolvable, CommandInteractionOptionResolver } from "discord.js";
import { ConnectOptions } from "mongoose";
import NoCliHandler from "..";
import Command from "../command-handler/Command";

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