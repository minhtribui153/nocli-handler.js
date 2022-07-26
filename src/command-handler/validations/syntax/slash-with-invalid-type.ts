import { ApplicationCommandOptionType } from "discord.js";
import NoCliCommandError from "../../../errors/NoCliCommandError";
import Command from "../../Command";

export default (command: Command) => {
    const { commandObject: { options = [] } } = command;

    for (const option of options) {
        if (typeof option.type !== "number") {
            throw new NoCliCommandError(`Command "${command.commandName}" has an invalid option type for "${option.name}"`);
        }
    }
}