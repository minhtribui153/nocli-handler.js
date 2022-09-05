"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const discord_js_1 = require("discord.js");
const handle_command_autocomplete_1 = __importDefault(require("../../functions/handle-command-autocomplete"));
const types_1 = require("../../types");
exports.default = {
    description: "Specifies what commands can be ran inside of what channels",
    type: types_1.NoCliCommandType.Slash,
    guildOnly: true,
    options: [
        {
            name: 'command',
            description: "The command to restrict to specific channels",
            required: true,
            type: discord_js_1.ApplicationCommandOptionType.String,
            autocomplete: true,
        },
        {
            name: 'channel',
            description: 'The channel to use for this command',
            required: false,
            type: discord_js_1.ApplicationCommandOptionType.Channel,
        }
    ],
    autocomplete: (interaction, command) => (0, handle_command_autocomplete_1.default)(command.instance.commands, interaction.guildId),
    callback: async ({ instance, guild, options }) => {
        const commandName = options.getString('command', true);
        const channel = options.getChannel('channel');
        const command = instance.commandHandler?.commands.get(commandName.toLowerCase());
        if (!command)
            return {
                content: `${instance.emojiConfig.error} Command "${commandName}" doesn't exist`,
                ephemeral: true,
            };
        const { channelCommands } = instance.commandHandler;
        let availableChannels = [];
        if (!channel) {
            const availableChannels = await channelCommands.getAvailableChannels(guild.id, commandName);
            return `${instance.emojiConfig.info} Channels that can run this command: ${availableChannels.length ? availableChannels.map(c => `<#${c}> `) : "None"}`;
        }
        const canRun = (await channelCommands.getAvailableChannels(guild.id, commandName)).includes(channel.id);
        if (canRun) {
            availableChannels = await channelCommands.remove(guild.id, commandName, channel.id);
        }
        else {
            availableChannels = await channelCommands.add(guild.id, commandName, channel.id);
        }
        if (availableChannels.length) {
            const channelNames = availableChannels.map(c => `<#${c}> `);
            return `${instance.emojiConfig.enabled} Command "${commandName}" can now be ran in the following channels: ${channelNames}`;
        }
        return `${instance.emojiConfig.disabled} Command "${commandName}" can now be ran inside of any channel.`;
    }
};
