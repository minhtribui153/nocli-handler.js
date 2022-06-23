"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = (command, usage, prefix) => {
    const { minArgs = 0, maxArgs = -1 } = command.commandObject;
    const { length } = usage.args;
    if ((length < minArgs) || (length > maxArgs && maxArgs !== -1)) {
        let text = command.commandObject.correctSyntax ?? `Invalid Syntax! Correct Syntax: \`${prefix}${command.commandName} ${command.commandObject.expectedArgs}\``;
        const specifyUsage = command.commandObject.expectedArgs ?? "";
        if (usage.message)
            usage.message.reply(text.replace("[PREFIX]", prefix).replace("[ARGS]", specifyUsage));
        else if (usage.interaction)
            usage.interaction.reply(text.replace("[PREFIX]", prefix).replace("[ARGS]", specifyUsage));
        return false;
    }
    return true;
};
