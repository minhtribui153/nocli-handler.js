declare class ChannelCommands {
    _channelCommands: Map<string, string[]>;
    action(action: "add" | "remove", guildId: string, commandName: string, channelId: string): Promise<string[]>;
    add(guildId: string, commandName: string, channelId: string): Promise<string[]>;
    remove(guildId: string, commandName: string, channelId: string): Promise<string[]>;
    getAvailableChannels(guildId: string, commandName: string): Promise<string[]>;
}
export default ChannelCommands;
