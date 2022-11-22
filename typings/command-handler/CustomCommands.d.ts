import { CommandInteraction, Message } from "discord.js";
import CommandHandler from "./CommandHandler";
/** The nocli-handler.js feature class that handles custom commands */
declare class CustomCommands {
    private _customCommands;
    private _commandHandler;
    constructor(commandHandler: CommandHandler);
    get commands(): Map<string, string>;
    /** Loads the custom commands */
    loadCommands(): Promise<void>;
    /**
     * Creates a custom command for a guild
     * @param {string} guildId The Guild ID
     * @param {string} commandName The command name
     * @param {string} description The command description
     * @param {string} response The command response
     * @returns {Promise<void>}
     */
    create(guildId: string, commandName: string, description: string, response: string): Promise<void>;
    /**
     * Deletes a custom command from a guild
     * @param {string} guildId The Guild ID
     * @param {string} commandName The command name
     * @returns {Promise<void>}
     */
    delete(guildId: string, commandName: string): Promise<void>;
    /**
     * Runs a custom command in a guild
     * @param {string} commandName The command name
     * @param {Message} message The Message instance
     * @param {CommandInteraction} interaction The CommandInteraction instance
     * @returns {Promise<void>}
     */
    run(commandName: string, message?: Message, interaction?: CommandInteraction): Promise<void>;
}
export default CustomCommands;
