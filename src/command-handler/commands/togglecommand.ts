import { ApplicationCommandOptionType } from "discord.js";
import handleCommandAutocomplete from "../../functions/handle-command-autocomplete";
import { ICommand } from "../../types";

export default {
    description: "Enables/Disables a command for your guild",

    type: "Slash",
    guildOnly: true,

    permissions: ["Administrator"],

    options: [
        {
            name: "command",
            description: "The command to enable/disable",
            type: ApplicationCommandOptionType.String,
            required: true,
            autocomplete: true
        }
    ],

    autocomplete: (interaction, command) => handleCommandAutocomplete(command.instance.commands!, interaction.guildId),

    callback: async ({ instance, guild, text: commandName }) => {
        const { disabledCommands } = instance.commandHandler!;

        let disabled: boolean = false;

        if (disabledCommands.isDisabled(guild!.id, commandName)) {
            await disabledCommands.enable(guild!.id, commandName);
            disabled = false;
        } else {
            await disabledCommands.disable(guild!.id, commandName);
            disabled = true;
        }

        return `${disabled ? instance.emojiConfig.disabled : instance.emojiConfig.enabled} Command "${commandName}" has been ${disabled ? "disabled" : "enabled"}`
    }

} as ICommand;