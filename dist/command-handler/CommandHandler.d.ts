import { Client } from "discord.js";
import { NoCliLanguageType } from "../types";
import NoCliHandler from "..";
import Command from "./Command";
declare class CommandHandler {
    commands: Map<string, Command>;
    commandsDir: string;
    private _suffix;
    private _debugging;
    private _defaultPrefix;
    private _instance;
    private _runTimeValidations;
    private _syntaxValidations;
    constructor(instance: NoCliHandler, commandsDir: string, language: NoCliLanguageType);
    private readFiles;
    importFile(filePath: string): Promise<any>;
    messageListener(client: Client): Promise<void>;
}
export default CommandHandler;
