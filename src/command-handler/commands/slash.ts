import { ApplicationCommandOptionType, EmbedBuilder } from "discord.js";
import { ICommand, NoCliCommandType } from "../../types";

const slashCommandName = "slash"

export default {
    description: "Deletes a slash command instance",
    
    type: NoCliCommandType.Slash,
    ownerOnly: true,
    
    options: [
        {
            name: "target",
            description: "The target to remove the command from",
            type: ApplicationCommandOptionType.String,
            required: true,
            autocomplete: true,
        },
        {
            name: "command",
            description: "The slash command to delete",
            type: ApplicationCommandOptionType.String,
            required: false,
            autocomplete: true
        }
    ],
    
    autocomplete: async (interaction, command, arg) => {
        
        if (arg === "target") {
            const guildIds = command.instance.client.guilds.cache.map(guild => guild.id)
            return ['Global', 'Current Guild', ...guildIds]
        } else if (arg === "command") {
            const target = interaction.options.getString('target') as "Global" | "Current Guild" | string;
            // commandName-commandId
            const getGuildIfAny = command.instance.client.guilds.cache.find(guild => guild.id === target);
            const allCommands = target === "Global"
                ? await command.instance.commandHandler!.slashCommands.getCommands()
                : target === "Current Guild" && interaction.guildId
                    ? await command.instance.commandHandler!.slashCommands.getCommands(interaction.guildId)
                    : getGuildIfAny
                        ? await command.instance.commandHandler!.slashCommands.getCommands(getGuildIfAny.id)
                        : undefined
            
            if (target !== "Global" && target !== "Current Guild") {
                const application = command.instance.client.application
                if (application) application.commands.cache.forEach((cmd, key) => allCommands ? allCommands.cache.set(key, cmd) : "")
            }
            const allCommandsKeyIds: string[] = [];

            if (allCommands) allCommands.cache.forEach(command => allCommandsKeyIds.push(`${command.name}-${command.id}`))

            const slashCommand = command.instance.client.application!.commands.cache.find(command => command.name === slashCommandName)!;
            const slashCommandKeyId = `${slashCommand.name}-${slashCommand.id}`

            const filteredCommandsKeyIds = allCommandsKeyIds.filter(keyId => keyId !== slashCommandKeyId);
            return filteredCommandsKeyIds;
        }
    },
    
    callback: async ({ interaction, options, instance, guild, args }) => {
        // Global | Current Guild | guildId: string
        const target = options!.getString('target', true) as "Global" | "Current Guild" | string;
        // commandName-commandId
        const commandKeyId = options!.getString('command');
        const getGuildIfAny = instance.client.guilds.cache.find(guild => guild.id === target);

        const allCommands = target === "Global"
            ? await instance.commandHandler!.slashCommands.getCommands()
            : target === "Current Guild"
                ? await instance.commandHandler!.slashCommands.getCommands(interaction!.guildId)
                : getGuildIfAny
                    ? await instance.commandHandler!.slashCommands.getCommands(getGuildIfAny.id)
                    : undefined
        
        if (target !== "Global" && target !== "Current Guild") {
            const application = instance.client.application
            if (application) application.commands.cache.forEach((cmd, key) => allCommands ? allCommands.cache.set(key, cmd) : "")
        }

        const allCommandsKeyIds: string[] = []

        if (allCommands) allCommands.cache.forEach(command => allCommandsKeyIds.push(`${command.name}-${command.id}`))

        
        const targetGuild = target !== "Global" && target !== "Current Guild"
            ? ` ${target}`
            : "";
        const currentTarget = target === "Global"
            ? "Global"
            : target === "Current Guild"
                ? "Current Guild"
                : "Guild"
        
        if (!commandKeyId) {
            const embed = new EmbedBuilder()
                .setTitle('Enabled Slash Commands')
                .setDescription(`Target: ${currentTarget}${targetGuild}`)
                .addFields(allCommandsKeyIds.map(keyId => {
                    const [name, id] = keyId.split('-');
                    return {
                        name,
                        value: id
                    }
                }))
                .setColor("Random")
                .setFooter({ text: `${allCommandsKeyIds.length} Command${allCommandsKeyIds.length === 1 ? "" : "s"} in total` });
            if (!allCommandsKeyIds.length) embed.setFooter({ text: "No Commands Found" })
            return {
                embeds: [embed],
                ephemeral: true
            }
        }
        
        const [commandName, commandId] = commandKeyId.split('-');

        if (currentTarget === "Current Guild") {
            if (!guild) return {
                content: `${instance.emojiConfig.error} You are currently in a DM with me. Please join a server with me invited to use "${currentTarget}"`,
                ephemeral: true
            }
            const command = await instance.commandHandler!.slashCommands.findCommand(commandId, guild.id);
            if (!command) return {
                content: `${instance.emojiConfig.error} Cannot find command "${commandName}" with ID "${commandId}"`,
                ephemeral: true
            }

            await instance.commandHandler!.slashCommands.delete(commandName, guild.id);

            return {
                content: `${instance.emojiConfig.success} Successfully deleted ${commandName} from this server`,
                ephemeral: true
            }
        } else if (currentTarget === "Guild") {
            const targetGuild = instance.client.guilds.cache.get(target)
            if (!targetGuild) return {
                content: `${instance.emojiConfig.error} Cannot find guild with ID "${target}"`,
                ephemeral: true
            }

            const command = await instance.commandHandler!.slashCommands.findCommand(commandId, targetGuild.id);
            if (!command) return {
                content: `${instance.emojiConfig.error} Cannot find command "${commandName}" with ID "${commandId}"`,
                ephemeral: true
            }

            await instance.commandHandler!.slashCommands.delete(commandName, targetGuild.id);

            return {
                content: `${instance.emojiConfig.success} Successfully deleted ${commandName} from ${targetGuild.name} (${targetGuild.id})`,
                ephemeral: true
            }
        } else {
            const command = await instance.commandHandler!.slashCommands.findCommand(commandId);
            if (!command) return {
                content: `${instance.emojiConfig.error} Cannot find command "${commandName}" with ID "${commandId}"`,
                ephemeral: true
            }

            await instance.commandHandler!.slashCommands.delete(commandName);
        }

        return {
            content: `${instance.emojiConfig.success} Successfully deleted ${commandName} globally. This will take at least 30 seconds for all commands to be removed from all servers`,
            ephemeral: true
        }
    }
} as ICommand