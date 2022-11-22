"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const channel_commands_schema_1 = __importDefault(require("../models/channel-commands-schema"));
class ChannelCommands {
    _channelCommands = new Map();
    /**
     * Adds or removes a command from a channel
     * @param {"add" | "remove"} action Whether to add or remove the command
     * @param {string} guildId The Guild ID
     * @param {string} commandName The command name
     * @param {string} channelId The Channel ID
     * @returns
     */
    async action(action, guildId, commandName, channelId) {
        const _id = `${guildId}-${commandName}`;
        const result = await channel_commands_schema_1.default.findOneAndUpdate({
            _id
        }, {
            _id,
            [action === 'add' ? '$addToSet' : '$pull']: {
                channels: channelId,
            }
        }, {
            upsert: true,
            new: true
        });
        this._channelCommands.set(_id, result.channels);
        return result.channels;
    }
    /**
     * Adds a command to a channel
     * @param {string} guildId The Guild ID
     * @param {string} commandName The command name
     * @param {string} channelId The Channel ID
     * @returns
     */
    async add(guildId, commandName, channelId) {
        return await this.action('add', guildId, commandName, channelId);
    }
    /**
     * Removes a command from a channel
     * @param {string} guildId The Guild ID
     * @param {string} commandName The command name
     * @param {string} channelId The Channel ID
     * @returns
     */
    async remove(guildId, commandName, channelId) {
        return await this.action('remove', guildId, commandName, channelId);
    }
    /**
     * Gets all the available channels in a guild
     * @param {string} guildId The Guild ID
     * @param {string} commandName The command name
     * @returns
     */
    async getAvailableChannels(guildId, commandName) {
        const _id = `${guildId}-${commandName}`;
        let channels = this._channelCommands.get(_id);
        if (!channels) {
            const results = await channel_commands_schema_1.default.findById(_id);
            channels = results ? results.channels : [];
            this._channelCommands.set(_id, channels);
        }
        return channels;
    }
}
exports.default = ChannelCommands;
