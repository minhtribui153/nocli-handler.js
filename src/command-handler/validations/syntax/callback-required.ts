import Command from "../../Command";
import NoCliCommandError from "../../../errors/NoCliCommandError";

export default (command: Command) => {
    const { commandObject, commandName } = command;

    if (!commandObject.callback) throw new NoCliCommandError(`Command "${commandName}" does not have a callback function`);
}