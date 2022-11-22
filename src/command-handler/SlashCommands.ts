import { ApplicationCommand, ApplicationCommandManager, ApplicationCommandOption, ApplicationCommandOptionData, ApplicationCommandOptionType, Client, GuildApplicationCommandManager } from "discord.js";
import handleError from "../functions/handle-error";
import { log } from "../functions/log";
import { ICommand } from "../types";

/** The nocli-handler.js feature class to handle slash commands */
class SlashCommands {
    private _client: Client;
    private _showFullErrorLog: boolean | undefined;

    constructor(client: Client, showFullErrorLog: boolean | undefined) {
        this._client = client;
        this._showFullErrorLog = showFullErrorLog;
    }

    /**
     * Gets the Slash commands based on the guild ID.
     * @param {string | null | undefined} guildId The Guild ID (optional)
     * @returns {Promise<ApplicationCommandManager | GuildApplicationCommandManager>}
     */
    async getCommands(guildId?: string | null): Promise<ApplicationCommandManager | GuildApplicationCommandManager> {
        let commands;
        if (guildId) {
            const guild = await this._client.guilds.fetch(guildId);
            commands = guild.commands;
        } else {
            commands = this._client.application!.commands;
        };

        // @ts-ignore
        await commands.fetch()

        return commands;
    }

    /**
     * Finds a slash command
     * @param {string} commandId The Slash Command ID
     * @param {string | undefined} guildId The Guild ID
     * @returns {Promise<ApplicationCommand<{}> | undefined>}
     */
    async findCommand(commandId: string, guildId?: string): Promise<ApplicationCommand<{}> | undefined> {
        const commands = await this.getCommands(guildId);

        const command = commands.cache.get(commandId);

        return command;
    }

    /**
     * Checks if the new slash command option and the old one are different
     * @param {ApplicationCommandOption[]} existingOptions The current slash command options.
     * @param {ApplicationCommandOptionData[]} options The new slash command options.
     * @returns {boolean}
     */
    optionsAreDifferent(existingOptions: ApplicationCommandOption[], options: ApplicationCommandOptionData[]): boolean {
        for (let i = 0; i < options.length; ++i) {
            const option = options[i];
            const existing = existingOptions[i];

            const isDifferent = option.name !== existing.name || option.type !== existing.type || option.description !== existing.description;
            if (isDifferent) return true;
        }

        return false
    }

    /**
     * Creates a new Slash Command
     * @param {string} name The name of the command
     * @param {string} description The description of the command
     * @param options The command options
     * @param guildId The guild ID (optional)
     */
    async create(name: string, description: string, options: ApplicationCommandOptionData[] = [], guildId?: string) {
        const lowerCaseName = name.toLowerCase();
        const commands = await this.getCommands(guildId);
        if (!commands) return;

        const existingCommand = commands.cache.find(cmd => cmd.name === lowerCaseName);
        if (existingCommand) {
            const { description: existingDescription, options: existingOptions } = existingCommand;
            if (
                existingDescription !== description ||
                existingOptions.length !== options.length ||
                this.optionsAreDifferent(existingOptions, options)
            ) {
                log("NoCliHandler", "info", `Automatically updating slash command "${name}"${guildId ? ` for Guild with ID "${guildId}"` : ''}`);

                await commands.edit(existingCommand.id, {
                    description,
                    // @ts-ignore
                    options,
                })
            }
            return;
        }


        log("NoCliHandler", "info", `Deploying slash command "${name}" ${guildId ? `to Guild with ID "${guildId}"` : ''}`);

        

        return await commands
            .create({
                name: lowerCaseName,
                description,
                options
            })
            .catch((err) => handleError(err as any, this._showFullErrorLog))
    }

    /**
     * Deletes a Slash Command
     * @param commandName The name of the command
     * @param guildId The guild ID (optional)
     */
    async delete(commandName: string, guildId: string = '') {
        const commands = await this.getCommands(guildId);

        if (!commands) return;

        const targetCommand = commands.cache.find(cmd => cmd.name === commandName) as ApplicationCommand;
        if (!targetCommand) return;

        log("NoCliHandler", "info", `Deleting slash command "${commandName}" ${guildId ? `from Guild with ID "${guildId}"` : ''}`);

        targetCommand
            .delete()
            .catch((err) => handleError(err as any, this._showFullErrorLog));
    }

    /**
     * Creates options for a Slash Command
     * @param param0 The ICommand Interface
     * @returns {ApplicationCommandOptionData[]}
     */
    createOptions({ expectedArgs = '', minArgs = 0, expectedArgsTypes = [] }: ICommand): ApplicationCommandOptionData[] {
        const options: ApplicationCommandOptionData[] = [];

        const split = expectedArgs
            // Removing the start < or [ and the ending > or ]
            .substring(1, expectedArgs.length - 1)
            // arg_name> <arg_name
            .split(/[>\]] [<\[]/)
        
        for (var a = 0; a < split.length; ++a) {
            const item = split[a];
            if (item.length === 0) continue;
            // @ts-ignore
            options.push({
                name: item.toLowerCase().replace(/\s+/g, '-'),
                description: item,
                type: expectedArgsTypes.length >= (a + 1)
                ? expectedArgsTypes[a]
                : ApplicationCommandOptionType.String,
                required: a < minArgs,
            })
        }

        return options;
    }
}

export default SlashCommands;