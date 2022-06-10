
import { Client, Message } from "discord.js";
import { ConnectOptions } from "mongoose";

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
    /** The language you are using to develop your Discord.JS Bot  */
    language: NoCliLanguageType;
}

export type NoCliEnvironmentType = "PRODUCTION" | "DEVELOPMENT" | "TESTING";
export type NoCliLanguageType = "TypeScript" | "JavaScript";

// Command Reference:
export interface ICommand {
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
    usage?: string;
    callback: (options: CommandCallbackOptions) => void;
}

export type CommandCallbackOptions = {
    /** The Discord.JS Client Instance */
    client: Client;
    /** The Discord.JS Message Instance */
    message: Message;
    /** The arguments passed to the command */
    args: string[];
    /** The arguments combined into a string */
    text: string;
}