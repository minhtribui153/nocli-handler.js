import { Client } from "discord.js";
import { MongoDBConnection, ConfigOptions, DebugOptions, NoCliCooldownConfigOptions, NoCliEmojiConfigOptions, NoCliLanguageType } from "./types";
export interface NoCliHandlerOptions {
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
