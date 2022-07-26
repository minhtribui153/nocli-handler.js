import NoCliCommandError from "../../../errors/NoCliCommandError";
import Command from "../../Command";

export default (command: Command) => {
    const { aliases = [], type } = command.commandObject;
    if (aliases.length && type === "SLASH") {
        throw new NoCliCommandError(`Command ${command.commandName} is a Slash-only command but with aliases`);
    }
}