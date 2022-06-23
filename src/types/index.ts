import { ApplicationCommandOptionData, Client, CommandInteraction, Guild, Message } from "discord.js";
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
    /** The test guilds testonly commands can only work in  */
    testServers?: string[];
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
    /** Whether the command is slash command, legacy command, or both */
    slash?: NoCliIsSlash;
    /** Tells the command handler whether to disable this command from interaction with the guilds */
    delete?: boolean;
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
    /** Whether the command is for test guilds or not  */
    testOnly?: boolean;
    /** 
     * The Discord.JS arguments (only works for Slash Commands)
     * Specify this if you are used to handle Discord.JS arguments with Slash Commands.
     */
    options?: ApplicationCommandOptionData[];
    /** The function to execute when the command is called */
    callback: (options: CommandCallbackOptions) => any;
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

}

export type NoCliIsSlash = boolean | "both";