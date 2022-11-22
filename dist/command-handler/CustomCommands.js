"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const custom_commands_schema_1 = __importDefault(require("../models/custom-commands-schema"));
/** The nocli-handler.js feature class that handles custom commands */
class CustomCommands {
    _customCommands = new Map();
    _commandHandler;
    constructor(commandHandler) {
        this._commandHandler = commandHandler;
        this.loadCommands();
    }
    // guildId-commandName: response
    get commands() { return this._customCommands; }
    /** Loads the custom commands */
    async loadCommands() {
        const results = await custom_commands_schema_1.default.find({});
        for (const result of results) {
            const { _id, response } = result;
            this._customCommands.set(_id, response);
        }
    }
    /**
     * Creates a custom command for a guild
     * @param {string} guildId The Guild ID
     * @param {string} commandName The command name
     * @param {string} description The command description
     * @param {string} response The command response
     * @returns {Promise<void>}
     */
    async create(guildId, commandName, description, response) {
        const _id = `${guildId}-${commandName}`;
        this._customCommands.set(_id, response);
        this._commandHandler.slashCommands.create(commandName, description, [], guildId);
        await custom_commands_schema_1.default.findOneAndUpdate({ _id }, { _id, response }, { upsert: true });
    }
    /**
     * Deletes a custom command from a guild
     * @param {string} guildId The Guild ID
     * @param {string} commandName The command name
     * @returns {Promise<void>}
     */
    async delete(guildId, commandName) {
        const _id = `${guildId}-${commandName}`;
        this._customCommands.delete(_id);
        this._commandHandler.slashCommands.delete(commandName, guildId);
        await custom_commands_schema_1.default.deleteOne({ _id });
    }
    /**
     * Runs a custom command in a guild
     * @param {string} commandName The command name
     * @param {Message} message The Message instance
     * @param {CommandInteraction} interaction The CommandInteraction instance
     * @returns {Promise<void>}
     */
    async run(commandName, message, interaction) {
        const guild = message ? message.guild : interaction.guild;
        if (!guild)
            return;
        const _id = `${guild.id}-${commandName}`;
        const response = this._customCommands.get(_id);
        if (!response)
            return;
        if (message)
            message.channel.send(response).catch(() => { });
        else if (interaction)
            interaction.reply(response).catch(() => { });
    }
}
exports.default = CustomCommands;
