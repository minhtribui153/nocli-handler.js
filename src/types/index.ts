import { Channel, ApplicationCommandOptionData, Client, CommandInteraction, Guild, GuildMember, Message, TextBasedChannel, User, ApplicationCommandOptionType } from "discord.js";
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
    mongoDB?: {
        /** The MongoDB URI */
        uri: string;
        /** The MongoDB options (optional) */
        options?: ConnectOptions;
    }
    configuration: {
        /** The default prefix for the bot (default prefix = "!") */
        defaultPrefix?: string;
        /** The directory where the commands are stored */
        commandsDir?: string;
        /** The directory where the features are stored */
        featuresDir?: string;
    };
    debugging?: {
        /** Whether or not to show the full error log */
        showFullErrorLog?: boolean;
        /** Whether or not to show the banner upon the start of the program  */
        showBanner?: boolean;
    };
    cooldownConfig?: {
        /** Sets the default error message for cooldowns, if any */
        defaultErrorMessage?: string;
        /** Whether to allow bot owners to bypass cooldowns */
        botOwnersBypass?: boolean;
        /** If a command cooldown exceeds the current cooldown limit set for this option, they will be stored in a MongoDB database ()  */
        dbRequired: number;
    };
    /** The test guilds `testonly` commands can only work in  */
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

// NoCliCooldown Reference:
export type NoCliCooldownOptions = {
    instance: NoCliHandler;
    errorMessage?: string | undefined;
    botOwnersBypass?: boolean | undefined;
    dbRequired?: number | undefined;
}

export type NoCliCooldownKeyOptions = {
    cooldownType: NoCliCooldownType;
    userId: string;
    actionId: string;
    guildId?: string;
    duration?: string | number;
    errorMessage?: string;
}

export type NoCliRuntimeValidationType = (command: Command, usage: CommandCallbackOptions, prefix: string) => boolean;
export type NoCliSyntaxValidationType = (command: Command) => void;

export type NoCliEnvironmentType = "PRODUCTION" | "DEVELOPMENT" | "TESTING";
export type NoCliLanguageType = "TypeScript" | "JavaScript";
export type NoCliCooldownType = typeof cooldownTypesArray[number];

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
    /** The correct syntax on how the arguments should be in place. */
    expectedArgs?: string;
    /** Defines the Slash Command option property for expectedArgs */
    expectedArgsTypes?: ApplicationCommandOptionType[];
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
    cooldowns: NoCliCommandCooldown;
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