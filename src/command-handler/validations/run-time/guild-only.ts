import { CommandCallbackOptions } from "../../../types";
import Command from "../../Command";

export default (command: Command, usage: CommandCallbackOptions, prefix: string) => {
    const { commandObject } = command;
    const { guild, message, interaction } = usage;

    if (commandObject.guildOnly && !guild) {
        const text = "This command can only be ran within a server.";

        if (message) message.reply(text);
        else if (interaction) interaction.reply({ content: text, ephemeral: true });

        return false;
    }

    return true;
}