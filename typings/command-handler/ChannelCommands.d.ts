declare class ChannelCommands {
    _channelCommands: Map<string, string[]>;
    /**
     * Adds or removes a command from a channel
     * @param {"add" | "remove"} action Whether to add or remove the command
     * @param {string} guildId The Guild ID
     * @param {string} commandName The command name
     * @param {string} channelId The Channel ID
     * @returns
     */
    action(action: "add" | "remove", guildId: string, commandName: string, channelId: string): Promise<string[]>;
    /**
     * Adds a command to a channel
     * @param {string} guildId The Guild ID
     * @param {string} commandName The command name
     * @param {string} channelId The Channel ID
     * @returns
     */
    add(guildId: string, commandName: string, channelId: string): Promise<string[]>;
    /**
     * Removes a command from a channel
     * @param {string} guildId The Guild ID
     * @param {string} commandName The command name
     * @param {string} channelId The Channel ID
     * @returns
     */
    remove(guildId: string, commandName: string, channelId: string): Promise<string[]>;
    /**
     * Gets all the available channels in a guild
     * @param {string} guildId The Guild ID
     * @param {string} commandName The command name
     * @returns
     */
    getAvailableChannels(guildId: string, commandName: string): Promise<string[]>;
}
export default ChannelCommands;
