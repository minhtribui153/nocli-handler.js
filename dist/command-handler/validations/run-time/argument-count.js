"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const log_1 = require("../../../functions/log");
exports.default = (command, usage, prefix) => {
    const { minArgs = 0, maxArgs = -1 } = command.commandObject;
    const { length } = usage.args;
    if ((length < minArgs) || (length > maxArgs && maxArgs !== -1)) {
        let text = command.commandObject.correctSyntax ?? `Invalid Syntax! Correct Syntax: \`${prefix}${command.commandName} ${command.commandObject.usage}\``;
        const specifyUsage = command.commandObject.usage ?? "";
        if (specifyUsage === "") {
            (0, log_1.log)("NoCliHandler", "info", `Command "${command.commandName}" does not have a valid usage! <> = required, [] = optional`);
            return false;
        }
        usage.message.reply(text.replace("[PREFIX]", prefix).replace("[USAGE]", specifyUsage));
        return false;
    }
    return true;
};
