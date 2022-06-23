import { ApplicationCommandOptionData, Client, SplitOptions } from "discord.js";
import handleError from "../functions/handle-error";
import { log } from "../functions/log";
import { ICommand } from "../types";

class SlashCommands {
    private _client: Client;
    private _showFullErrorLog: boolean | undefined;

    constructor(client: Client, showFullErrorLog: boolean | undefined) {
        this._client = client;
        this._showFullErrorLog = showFullErrorLog;
    }

    /**
     * Gets the Slash commands based on the guild ID.
     * @param guildId The guild id (optional)
     */
    getCommands(guildId?: string) {
        if (guildId) return this._client.guilds.cache.get(guildId)?.commands;

        return this._client.application!.commands;
    }

    /**
     * Creates a new Slash Command
     * @param name The name of the command
     * @param description The description of the command
     * @param options The command options
     * @param guildId The guild ID (optional)
     */
    async create(name: string, description: string, options: ApplicationCommandOptionData[] = [], guildId?: string) {
        const commands = this.getCommands(guildId);
        if (!commands) return;

        // @ts-ignore
        await commands.fetch()

        const existingCommand = commands.cache.find(cmd => cmd.name === name);
        if (existingCommand) {
            log("NoCliHandler", "info", `Command "${name}" already exists, ignoring`)
            return;
        }


        log("NoCliHandler", "info", `Deploying slash command "${name}" ${guildId ? `to Guild with ID "${guildId}"` : ''}`);

        return await commands
            .create({
                name,
                description,
                options
            })
            .catch((err) => handleError(err as any, this._showFullErrorLog))
    }

    /**
     * Deletes a Slash Command
     * @param commandName The name of the command
     * @param guildId  The guild ID (optional)
     */
    async delete(commandName: string, guildId: string = '') {
        const commands = this.getCommands(guildId);

        if (!commands) return;
        
        // @ts-ignore
        await commands.fetch()

        const targetCommand = commands.cache.find(cmd => cmd.name === commandName);
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
    createOptions({ expectedArgs = '', minArgs = 0 }: ICommand): ApplicationCommandOptionData[] {
        const options: ApplicationCommandOptionData[] = [];

        const split = expectedArgs
            // Removing the start < or [ and the ending > or ]
            .substring(1, expectedArgs.length - 1)
            // arg_name> <arg_name
            .split(/[>\]] [<\[]/)
        
        for (var a = 0; a < split.length; ++a) {
            const item = split[a];
            if (item.length === 0) continue;
            options.push({
                name: item.toLowerCase().replace(/\s+/g, '-'),
                description: item,
                type: "STRING",
                required: a < minArgs,
            })
        }

        return options;
    }
}

export default SlashCommands;