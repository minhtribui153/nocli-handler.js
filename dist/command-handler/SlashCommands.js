"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
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
    getCommands(guildId) {
        if (guildId)
            return this._client.guilds.cache.get(guildId)?.commands;
        return this._client.application.commands;
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
    /** Re-edits the options if they do not follow the Slash Command format */
    reEditOptions(commandName, options) {
        for (let i = 0; i < options.length; ++i) {
            const name = options[i].name;
            let lowerCase = name.toLowerCase();
            if (lowerCase !== name)
                (0, log_1.log)("NoCliHandler", "warn", `Command "${commandName}" has option "${name}" with a upper case. All option names must be lowercase for slash commands. Automatically changing to "${lowerCase}"`);
            if (lowerCase.match(/\s/g)) {
                lowerCase = lowerCase.replace(/\s/g, '_');
                (0, log_1.log)("NoCliHandler", "warn", `Command "${commandName}" has option "${name}" with spaces. The best practice is for option names to only be one word. Automatically changing to "${lowerCase}"`);
            }
            options[i].name = lowerCase;
        }
        return options;
    }
    /**
     * Creates a new Slash Command
     * @param name The name of the command
     * @param description The description of the command
     * @param parsedOptions The command options
     * @param guildId The guild ID (optional)
     */
    async create(name, description, parsedOptions = [], guildId) {
        const commands = this.getCommands(guildId);
        if (!commands)
            return;
        const options = this.reEditOptions(name, parsedOptions);
        // @ts-ignore
        await commands.fetch();
        const existingCommand = commands.cache.find(cmd => cmd.name === name);
        if (existingCommand) {
            const { description: existingDescription, options: existingOptions } = existingCommand;
            if (existingDescription !== description ||
                existingOptions.length !== options.length ||
                this.optionsAreDifferent(existingOptions, options)) {
                (0, log_1.log)("NoCliHandler", "info", `Automatically updating slash command "${name}"${guildId ? ` for Guild with ID "${guildId}"` : ''}`);
                await commands.edit(existingCommand.id, {
                    name,
                    description,
                    options,
                });
            }
            return;
        }
        (0, log_1.log)("NoCliHandler", "info", `Deploying slash command "${name}" ${guildId ? `to Guild with ID "${guildId}"` : ''}`);
        return await commands
            .create({
            name,
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
        const commands = this.getCommands(guildId);
        if (!commands)
            return;
        // @ts-ignore
        await commands.fetch();
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
    createOptions({ expectedArgs = '', minArgs = 0 }) {
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
            options.push({
                name: item.toLowerCase().replace(/\s+/g, '-'),
                description: item,
                type: "STRING",
                required: a < minArgs,
            });
        }
        return options;
    }
}
exports.default = SlashCommands;
