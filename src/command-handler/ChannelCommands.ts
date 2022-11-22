import channelCommandsSchema from "../models/channel-commands-schema";

class ChannelCommands {

    public _channelCommands = new Map<string, string[]>();

    /**
     * Adds or removes a command from a channel
     * @param {"add" | "remove"} action Whether to add or remove the command
     * @param {string} guildId The Guild ID
     * @param {string} commandName The command name
     * @param {string} channelId The Channel ID
     * @returns 
     */
    public async action(action: "add" | "remove", guildId: string, commandName: string, channelId: string) {
        const _id = `${guildId}-${commandName}`;

        const result = await channelCommandsSchema.findOneAndUpdate(
            {
                _id
            },
            {
                _id,
                [action === 'add' ? '$addToSet' : '$pull']: {
                    channels: channelId,
                }
            },
            {
                upsert: true,
                new: true
            }
        )

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
    public async add(guildId: string, commandName: string, channelId: string) {
        return await this.action('add', guildId, commandName, channelId);
    }

    /**
     * Removes a command from a channel
     * @param {string} guildId The Guild ID
     * @param {string} commandName The command name
     * @param {string} channelId The Channel ID
     * @returns 
     */
    public async remove(guildId: string, commandName: string, channelId: string) {
        return await this.action('remove', guildId, commandName, channelId);
    }

    /**
     * Gets all the available channels in a guild
     * @param {string} guildId The Guild ID
     * @param {string} commandName The command name 
     * @returns 
     */
    public async getAvailableChannels(guildId: string, commandName: string) {
        const _id = `${guildId}-${commandName}`;
        let channels = this._channelCommands.get(_id);
        
        if (!channels) {
            const results = await channelCommandsSchema.findById(_id);
            channels = results ? results.channels : [];
            this._channelCommands.set(_id, channels);
        }

        return channels;
    }
}

export default ChannelCommands;