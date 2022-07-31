import NoCliCommandError from "../../../errors/NoCliCommandError";
import { NoCliCommandType } from "../../../types";
import Command from "../../Command";

export default (command: Command) => {
    const { aliases = [], type } = command.commandObject;
    if (aliases.length && type === NoCliCommandType.Slash) {
        throw new NoCliCommandError(`Command ${command.commandName} is a Slash-only command but with aliases`);
    }
}