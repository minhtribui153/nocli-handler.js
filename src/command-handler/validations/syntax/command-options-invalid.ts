import NoCliCommandError from "../../../errors/NoCliCommandError";
import { NoCliCommandTypeArray } from "../../../types";
import Command from "../../Command";

export default (command: Command) => {
    const { commandObject: { options = [], type } } = command;

    if (typeof type === "string" && !NoCliCommandTypeArray.includes(type)) {
        throw new NoCliCommandError(`Command ${command.commandName} has an invalid type. Type must either be NoCliCommandType, NoCliCommandTypeString or number.`);
    }

    for (const option of options) {
        if (typeof option.type !== "number") {
            throw new NoCliCommandError(`Command "${command.commandName}" has an invalid option type for "${option.name}"`);
        }
    }
}