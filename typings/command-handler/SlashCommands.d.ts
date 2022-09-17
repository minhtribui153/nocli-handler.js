import { ApplicationCommand, ApplicationCommandManager, ApplicationCommandOption, ApplicationCommandOptionData, Client, GuildApplicationCommandManager } from "discord.js";
import { ICommand } from "../types";
declare class SlashCommands {
    private _client;
    private _showFullErrorLog;
    constructor(client: Client, showFullErrorLog: boolean | undefined);
    /**
     * Gets the Slash commands based on the guild ID.
     * @param guildId The guild id (optional)
     */
    getCommands(guildId?: string | null): Promise<ApplicationCommandManager | GuildApplicationCommandManager>;
    findCommand(commandId: string, guildId?: string): Promise<ApplicationCommand<{}> | undefined>;
    /**
     * Checks if the new slash command option and the old one are different
     * @param {ApplicationCommandOption[]} existingOptions The current slash command options.
     * @param {ApplicationCommandOptionData[]} options The new slash command options.
     */
    optionsAreDifferent(existingOptions: ApplicationCommandOption[], options: ApplicationCommandOptionData[]): boolean;
    /**
     * Creates a new Slash Command
     * @param name The name of the command
     * @param description The description of the command
     * @param options The command options
     * @param guildId The guild ID (optional)
     */
    create(name: string, description: string, options?: ApplicationCommandOptionData[], guildId?: string): Promise<ApplicationCommand<{}> | undefined>;
    /**
     * Deletes a Slash Command
     * @param commandName The name of the command
     * @param guildId  The guild ID (optional)
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
