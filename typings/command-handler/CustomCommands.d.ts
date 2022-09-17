import { CommandInteraction, Message } from "discord.js";
import CommandHandler from "./CommandHandler";
declare class CustomCommands {
    private _customCommands;
    private _commandHandler;
    constructor(commandHandler: CommandHandler);
    get commands(): Map<string, string>;
    loadCommands(): Promise<void>;
    create(guildId: string, commandName: string, description: string, response: string): Promise<void>;
    delete(guildId: string, commandName: string): Promise<void>;
    run(commandName: string, message?: Message, interaction?: CommandInteraction): Promise<void>;
}
export default CustomCommands;
