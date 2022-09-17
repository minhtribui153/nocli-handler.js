import { CommandCallbackOptions } from "../../../types";
import Command from "../../Command";

export default (command: Command, usage: CommandCallbackOptions) => {
    const { instance, commandObject } = command;
    const { user } = usage;

    const { botOwners } = instance;

    if (commandObject.ownerOnly && !botOwners.includes(user.id)) {
        return false;
    }

    return true;
}