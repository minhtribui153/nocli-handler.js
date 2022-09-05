"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const discord_js_1 = require("discord.js");
const types_1 = require("../../types");
exports.default = {
    description: "Deletes a custom command from this server",
    type: types_1.NoCliCommandType.Slash,
    permissions: ["Administrator"],
    options: [
        {
            name: "command_name",
            description: "command_name",
            type: discord_js_1.ApplicationCommandOptionType.String,
            autocomplete: true,
            required: true,
        },
    ],
    guildOnly: true,
    autocomplete: (interaction, command) => {
        const commands = [];
        command.instance.commandHandler.customCommands.commands
            .forEach((_, id) => {
            const [guildId, commandName] = id.split("-");
            if (interaction.guildId === guildId)
                return commands.push(commandName);
            return commandName;
        });
        return commands;
    },
    callback: async ({ instance, text: commandName, guild }) => {
        if (!instance.commandHandler.customCommands.commands.has(`${guild.id}-${commandName}`))
            return {
                content: `${instance.emojiConfig.error} Custom command "${commandName}" not found!`,
                ephemeral: true,
            };
        await instance.commandHandler.customCommands.delete(guild.id, commandName);
        return `${instance.emojiConfig.success} Custom command "${commandName}" has been deleted!`;
    }
};
