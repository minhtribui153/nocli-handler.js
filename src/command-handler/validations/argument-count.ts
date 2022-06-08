import NoCliCommandError from "../../errors/NoCliCommandError";
import { CommandCallbackOptions } from "../../types";
import Command from "../Command";

export default (command: Command, usage: CommandCallbackOptions, prefix: string) => {
    const { minArgs = 0, maxArgs = -1 } = command.commandObject;
    const { length } = usage.args;

    if ((length < minArgs) || (length > maxArgs && maxArgs !== -1)) {
        let text = command.commandObject.correctSyntax ?? `Invalid Syntax! Correct Syntax: \`${prefix}${command.commandName} ${command.commandObject.usage}\``;
        const specifyUsage = command.commandObject.usage ?? "";
        if (specifyUsage === "") throw new NoCliCommandError("Command does not have a valid usage! <> = required, [] = optional");
        usage.message.reply(text.replace("[PREFIX]", prefix).replace("[USAGE]", specifyUsage));
        return false;
    }

    return true;
}