import { CommandCallbackOptions } from "../../../types";
import Command from "../../Command";

export default (command: Command, usage: CommandCallbackOptions, prefix: string) => {
    const { instance, commandObject } = command;
    const { guild } = usage;

    if (commandObject.testOnly !== true) return true;
    if (!guild) return true;

    return instance.testServers.includes(guild.id);
}