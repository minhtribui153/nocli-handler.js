import { Client } from "discord.js";
import { NoCliHandlerOptions, NoCliLanguageType } from "../types";
import Command from "./Command";
declare class CommandHandler {
    commands: Map<string, Command>;
    commandsDir: string;
    private _suffix;
    private _debugging;
    private _runTimeValidations;
    private _syntaxValidations;
    private _defaultPrefix;
    constructor(commandsDir: string, language: NoCliLanguageType, debugging: NoCliHandlerOptions["debugging"], defaultPrefix: string);
    private readFiles;
    importFile(filePath: string): Promise<any>;
    messageListener(client: Client): Promise<void>;
}
export default CommandHandler;
