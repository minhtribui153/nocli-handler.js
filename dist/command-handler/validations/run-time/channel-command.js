"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = async (command, usage, prefix) => {
    const { commandName, instance } = command;
    const { guild, channel, message, interaction } = usage;
    if (!guild)
        return true;
    const availableChannels = await instance.commandHandler.channelCommands.getAvailableChannels(guild.id, commandName);
    if (availableChannels.length && !availableChannels.includes(channel.id)) {
        const channelNames = availableChannels.map(c => `<#${c}> `);
        const reply = `${instance.emojiConfig.error} You can only run this command inside of the following channels: ${channelNames}`;
        if (message)
            message.reply(reply);
        else if (interaction)
            interaction.reply({ content: reply, ephemeral: true });
        return false;
    }
    return true;
};
