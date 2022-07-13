import NoCliCommandError from "../../../errors/NoCliCommandError";
import Command from "../../Command";

export default (command: Command) => {
    const { instance, commandName, commandObject } = command;
 
    if (commandObject.ownerOnly !== true || instance.botOwners.length) return;

    throw new NoCliCommandError(`Command "${commandName}" is a owner only command, but no owners are specified`);
}