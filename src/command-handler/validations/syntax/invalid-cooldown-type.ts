import Command from "../../Command";
import NoCliCommandError from "../../../errors/NoCliCommandError";
import { cooldownTypesArray } from "../../../types";

export default (command: Command) => {
    const { commandObject, commandName } = command;
    
    if (!commandObject.cooldowns) return;

    let counter = 0;
    for (const type of cooldownTypesArray) {
        // @ts-ignore
        if (commandObject.cooldowns[type]) ++ counter;
    }
    if (counter === 0) throw new NoCliCommandError(`Command "${commandName}" has a cooldown object, but no cooldown types were specified. Please use one of the following: ${cooldownTypesArray.join(', ')}`)
    if (counter > 1) throw new NoCliCommandError(`Command "${commandName}" has multiple cooldown types, you must specify only one`);

}