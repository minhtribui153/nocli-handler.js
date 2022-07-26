"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const discord_js_1 = require("discord.js");
const handle_error_1 = __importDefault(require("../functions/handle-error"));
const log_1 = require("../functions/log");
class SlashCommands {
    _client;
    _showFullErrorLog;
    constructor(client, showFullErrorLog) {
        this._client = client;
        this._showFullErrorLog = showFullErrorLog;
    }
    /**
     * Gets the Slash commands based on the guild ID.
     * @param guildId The guild id (optional)
     */
    async getCommands(guildId) {
        let commands;
        if (guildId) {
            const guild = await this._client.guilds.fetch(guildId);
            commands = guild.commands;
        }
        else {
            commands = this._client.application.commands;
        }
        ;
        // @ts-ignore
        await commands.fetch();
        return commands;
    }
    optionsAreDifferent(existingOptions, options) {
        for (let i = 0; i < options.length; ++i) {
            const option = options[i];
            const existing = existingOptions[i];
            const isDifferent = option.name !== existing.name || option.type !== existing.type || option.description !== existing.description;
            if (isDifferent)
                return true;
        }
        return false;
    }
    /**
     * Creates a new Slash Command
     * @param name The name of the command
     * @param description The description of the command
     * @param options The command options
     * @param guildId The guild ID (optional)
     */
    async create(name, description, options = [], guildId) {
        const lowerCaseName = name.toLowerCase();
        const commands = await this.getCommands(guildId);
        if (!commands)
            return;
        const existingCommand = commands.cache.find(cmd => cmd.name === lowerCaseName);
        if (existingCommand) {
            const { description: existingDescription, options: existingOptions } = existingCommand;
            if (existingDescription !== description ||
                existingOptions.length !== options.length ||
                this.optionsAreDifferent(existingOptions, options)) {
                (0, log_1.log)("NoCliHandler", "info", `Automatically updating slash command "${name}"${guildId ? ` for Guild with ID "${guildId}"` : ''}`);
                await commands.edit(existingCommand.id, {
                    description,
                    // @ts-ignore
                    options,
                });
            }
            return;
        }
        (0, log_1.log)("NoCliHandler", "info", `Deploying slash command "${name}" ${guildId ? `to Guild with ID "${guildId}"` : ''}`);
        return await commands
            .create({
            name: lowerCaseName,
            description,
            options
        })
            .catch((err) => (0, handle_error_1.default)(err, this._showFullErrorLog));
    }
    /**
     * Deletes a Slash Command
     * @param commandName The name of the command
     * @param guildId  The guild ID (optional)
     */
    async delete(commandName, guildId = '') {
        const commands = await this.getCommands(guildId);
        if (!commands)
            return;
        const targetCommand = commands.cache.find(cmd => cmd.name === commandName);
        if (!targetCommand)
            return;
        (0, log_1.log)("NoCliHandler", "info", `Deleting slash command "${commandName}" ${guildId ? `from Guild with ID "${guildId}"` : ''}`);
        targetCommand
            .delete()
            .catch((err) => (0, handle_error_1.default)(err, this._showFullErrorLog));
    }
    /**
     * Creates options for a Slash Command
     * @param param0 The ICommand Interface
     * @returns {ApplicationCommandOptionData[]}
     */
    createOptions({ expectedArgs = '', minArgs = 0, expectedArgsTypes = [] }) {
        const options = [];
        const split = expectedArgs
            // Removing the start < or [ and the ending > or ]
            .substring(1, expectedArgs.length - 1)
            // arg_name> <arg_name
            .split(/[>\]] [<\[]/);
        for (var a = 0; a < split.length; ++a) {
            const item = split[a];
            if (item.length === 0)
                continue;
            // @ts-ignore
            options.push({
                name: item.toLowerCase().replace(/\s+/g, '-'),
                description: item,
                type: expectedArgsTypes.length >= (a + 1)
                    ? expectedArgsTypes[a]
                    : discord_js_1.ApplicationCommandOptionType.String,
                required: a < minArgs,
            });
        }
        return options;
    }
}
exports.default = SlashCommands;
