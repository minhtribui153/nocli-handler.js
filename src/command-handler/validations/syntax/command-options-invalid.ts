import NoCliCommandError from "../../../errors/NoCliCommandError";
import Command from "../../Command";

export default (command: Command) => {
    const { commandObject: { options = [], type } } = command;

    if (typeof type !== "number") {
        throw new NoCliCommandError(`Command ${command.commandName} has an invalid type. Type must either be enum NoCliCommandType or number.`);
    }

    for (const option of options) {
        if (typeof option.type !== "number") {
            throw new NoCliCommandError(`Command "${command.commandName}" has an invalid option type for "${option.name}"`);
        }
    }
}