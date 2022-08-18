import Command from "../../Command";
import NoCliCommandError from "../../../errors/NoCliCommandError";

export default (command: Command) => {
    const { commandObject, commandName } = command;
    const { guildOnly = false, permissions = [] } = commandObject;
    
    if (!guildOnly && permissions.length) throw new NoCliCommandError(`Command "${commandName}" is not a guildOnly command, but permissions are specified.`);
}