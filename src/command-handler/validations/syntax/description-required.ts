import NoCliCommandError from "../../../errors/NoCliCommandError";
import Command from "../../Command";

export default (command: Command) => {
    const { commandObject, commandName } = command;

    if (!commandObject.description) throw new NoCliCommandError(`Command "${commandName}" does not have a description!`);
}