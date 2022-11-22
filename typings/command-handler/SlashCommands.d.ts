import { ApplicationCommand, ApplicationCommandManager, ApplicationCommandOption, ApplicationCommandOptionData, Client, GuildApplicationCommandManager } from "discord.js";
import { ICommand } from "../types";
/** The nocli-handler.js feature class to handle slash commands */
declare class SlashCommands {
    private _client;
    private _showFullErrorLog;
    constructor(client: Client, showFullErrorLog: boolean | undefined);
    /**
     * Gets the Slash commands based on the guild ID.
     * @param {string | null | undefined} guildId The Guild ID (optional)
     * @returns {Promise<ApplicationCommandManager | GuildApplicationCommandManager>}
     */
    getCommands(guildId?: string | null): Promise<ApplicationCommandManager | GuildApplicationCommandManager>;
    /**
     * Finds a slash command
     * @param {string} commandId The Slash Command ID
     * @param {string | undefined} guildId The Guild ID
     * @returns {Promise<ApplicationCommand<{}> | undefined>}
     */
    findCommand(commandId: string, guildId?: string): Promise<ApplicationCommand<{}> | undefined>;
    /**
     * Checks if the new slash command option and the old one are different
     * @param {ApplicationCommandOption[]} existingOptions The current slash command options.
     * @param {ApplicationCommandOptionData[]} options The new slash command options.
     * @returns {boolean}
     */
    optionsAreDifferent(existingOptions: ApplicationCommandOption[], options: ApplicationCommandOptionData[]): boolean;
    /**
     * Creates a new Slash Command
     * @param {string} name The name of the command
     * @param {string} description The description of the command
     * @param options The command options
     * @param guildId The guild ID (optional)
     */
    create(name: string, description: string, options?: ApplicationCommandOptionData[], guildId?: string): Promise<ApplicationCommand<{
        guild: import("discord.js").GuildResolvable;
    }> | undefined>;
    /**
     * Deletes a Slash Command
     * @param commandName The name of the command
     * @param guildId The guild ID (optional)
     */
    delete(commandName: string, guildId?: string): Promise<void>;
    /**
     * Creates options for a Slash Command
     * @param param0 The ICommand Interface
     * @returns {ApplicationCommandOptionData[]}
     */
    createOptions({ expectedArgs, minArgs, expectedArgsTypes }: ICommand): ApplicationCommandOptionData[];
}
export default SlashCommands;
