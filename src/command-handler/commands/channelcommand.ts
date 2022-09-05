import { Channel } from "diagnostics_channel";
import { ApplicationCommandOptionType, CommandInteractionOptionResolver, TextChannel } from "discord.js";
import handleCommandAutocomplete from "../../functions/handle-command-autocomplete";
import { ICommand, NoCliCommandType } from "../../types";

export default {
    description: "Specifies what commands can be ran inside of what channels",

    type: NoCliCommandType.Slash,
    guildOnly: true,

    options: [
        {
            name: 'command',
            description: "The command to restrict to specific channels",
            required: true,
            type: ApplicationCommandOptionType.String,
            autocomplete: true,
        },
        {
            name: 'channel',
            description: 'The channel to use for this command',
            required: false,
            type: ApplicationCommandOptionType.Channel,
        }
    ],

    autocomplete: (interaction, command) => handleCommandAutocomplete(command.instance.commands!, interaction.guildId),

    callback: async ({ instance, guild, options }) => {
        const commandName = options!.getString('command', true);
        const channel = options!.getChannel('channel');

        const command = instance.commandHandler?.commands.get(commandName.toLowerCase());
        if (!command) return {
            content: `${instance.emojiConfig.error} Command "${commandName}" doesn't exist`,
            ephemeral: true,
        }

        const { channelCommands } = instance.commandHandler!;

        
        let availableChannels = []
        
        if (!channel) {
            const availableChannels = await channelCommands.getAvailableChannels(guild!.id, commandName);
            
            return `${instance.emojiConfig.info} Channels that can run this command: ${availableChannels.length ? availableChannels.map(c => `<#${c}> `) : "None"}`
        }

        const canRun = (await channelCommands.getAvailableChannels(guild!.id, commandName)).includes(channel.id);

        if (canRun) {
            availableChannels = await channelCommands.remove(guild!.id, commandName, channel.id);
        } else {
            availableChannels = await channelCommands.add(guild!.id, commandName, channel.id);
        }

        if (availableChannels.length) {
            const channelNames = availableChannels.map(c => `<#${c}> `)

            return `${instance.emojiConfig.enabled} Command "${commandName}" can now be ran in the following channels: ${channelNames}`
        }

        return `${instance.emojiConfig.disabled} Command "${commandName}" can now be ran inside of any channel.`
    }
} as ICommand