import Command from "./Command";
import { Client } from "discord.js";
declare class CommandHandler {
    commands: Map<string, Command>;
    commandsDir: string;
    private validations;
    constructor(commandsDir: string);
    private readFiles;
    messageListener(client: Client): void;
}
export default CommandHandler;
