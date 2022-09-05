"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const discord_js_1 = require("discord.js");
const handle_command_autocomplete_1 = __importDefault(require("../../functions/handle-command-autocomplete"));
exports.default = {
    description: "Enables/Disables a command for your guild",
    type: "Slash",
    guildOnly: true,
    permissions: ["Administrator"],
    options: [
        {
            name: "command",
            description: "The command to enable/disable",
            type: discord_js_1.ApplicationCommandOptionType.String,
            required: true,
            autocomplete: true
        }
    ],
    autocomplete: (interaction, command) => (0, handle_command_autocomplete_1.default)(command.instance.commands, interaction.guildId),
    callback: async ({ instance, guild, text: commandName }) => {
        const { disabledCommands } = instance.commandHandler;
        let disabled = false;
        if (disabledCommands.isDisabled(guild.id, commandName)) {
            await disabledCommands.enable(guild.id, commandName);
            disabled = false;
        }
        else {
            await disabledCommands.disable(guild.id, commandName);
            disabled = true;
        }
        return `${disabled ? instance.emojiConfig.disabled : instance.emojiConfig.enabled} Command "${commandName}" has been ${disabled ? "disabled" : "enabled"}`;
    }
};
