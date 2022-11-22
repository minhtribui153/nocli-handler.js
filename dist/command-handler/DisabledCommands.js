"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const disabled_commands_schema_1 = __importDefault(require("../models/disabled-commands-schema"));
/** The nocli-handler.js feature class to disable commands */
class DisabledCommands {
    // array of `${guildId}-${commandName}`
    _disabledCommands = [];
    constructor() {
        this.loadDisabledCommands();
    }
    /** Loads the disabled commands */
    async loadDisabledCommands() {
        const results = await disabled_commands_schema_1.default.find({});
        for (const result of results) {
            this._disabledCommands.push(result._id);
        }
    }
    /**
     * Disables a command from a guild
     * @param {string} guildId The Guild ID
     * @param {string} commandName The command nam
     * @returns {Promise<void>}
     */
    async disable(guildId, commandName) {
        if (this.isDisabled(guildId, commandName))
            return;
        const _id = `${guildId}-${commandName}`;
        this._disabledCommands.push(_id);
        try {
            await new disabled_commands_schema_1.default({ _id }).save();
        }
        catch (ignored) { }
    }
    /**
     * Enables a command for a guild
     * @param {string} guildId The Guild ID
     * @param {string} commandName The command nam
     * @returns  {Promise<void>}
     */
    async enable(guildId, commandName) {
        if (!this.isDisabled(guildId, commandName))
            return;
        const _id = `${guildId}-${commandName}`;
        this._disabledCommands = this._disabledCommands.filter((id) => id !== _id);
        await disabled_commands_schema_1.default.deleteOne({ _id });
    }
    /**
     * Checks if the specified command name with guildId is disabled
     * @param {string} guildId The Guild ID
     * @param {string} commandName The command nam
     * @returns {boolean}
     */
    isDisabled(guildId, commandName) {
        return this._disabledCommands.includes(`${guildId}-${commandName}`);
    }
}
exports.default = DisabledCommands;
