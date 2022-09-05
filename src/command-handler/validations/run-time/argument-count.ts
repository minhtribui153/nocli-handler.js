import { CommandCallbackOptions } from "../../../types";
import Command from "../../Command";

export default (command: Command, usage: CommandCallbackOptions, prefix: string) => {
    const { minArgs = 0, maxArgs = -1, correctSyntax, expectedArgs = "" } = command.commandObject;
    const { length } = usage.args;
    
    if ((length < minArgs) || (length > maxArgs && maxArgs !== -1)) {
        let text = `${command.instance.emojiConfig.error} Invalid Syntax! Correct Syntax: \`${prefix}${command.commandName} ${expectedArgs}\``
            .replace("[PREFIX]", prefix)
            .replace("[ARGS]", expectedArgs)
        if (correctSyntax && correctSyntax.length > 0) {
            text = `${command.instance.emojiConfig.error} ` + correctSyntax.replace("[PREFIX]", prefix).replace("[ARGS]", expectedArgs);
        }

        const { message, interaction } = usage;

        if (message) message.reply(text);
        else if (interaction) interaction.reply({ content: text, ephemeral: true });
        return false;
    }

    return true;
}