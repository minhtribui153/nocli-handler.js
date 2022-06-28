"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = (command, usage, prefix) => {
    const { minArgs = 0, maxArgs = -1, correctSyntax, expectedArgs = "" } = command.commandObject;
    const { length } = usage.args;
    if ((length < minArgs) || (length > maxArgs && maxArgs !== -1)) {
        let text = `Invalid Syntax! Correct Syntax: \`${prefix}${command.commandName} ${expectedArgs}\``
            .replace("[PREFIX]", prefix)
            .replace("[ARGS]", expectedArgs);
        if (correctSyntax && correctSyntax.length > 0) {
            text = correctSyntax.replace("[PREFIX]", prefix).replace("[ARGS]", expectedArgs);
        }
        const { message, interaction } = usage;
        if (message)
            message.reply(text);
        else if (interaction)
            interaction.reply({ content: text, ephemeral: true });
        return false;
    }
    return true;
};
