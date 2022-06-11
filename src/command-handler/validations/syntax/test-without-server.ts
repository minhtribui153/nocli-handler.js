import NoCliCommandError from "../../../errors/NoCliCommandError";
import Command from "../../Command";

export default (command: Command) => {
    const { instance, commandName, commandObject } = command;

    if (commandObject.testOnly !== true || instance.testServers.length) return;

    throw new NoCliCommandError(`Command "${commandName}" is a test only command, but no test servers are specified`);
}