// Default import
import { Client } from "discord.js";
import { ICommand, NoCliLanguageType } from "../types";
import { log } from "../functions/log";
import getAllFiles from "../util/get-all-files";
import Command from "./Command";

// Validation imports
import argumentCount from "./validations/run-time/argument-count";
import callbackRequired from "./validations/syntax/callback-required";
import descriptionRequired from "./validations/syntax/description-required";


class CommandHandler {
    public commands: Map<string, Command> = new Map();
    public commandsDir: string;

    private _suffix: "js" | "ts";
    private _runTimeValidations = [argumentCount];
    private _syntaxValidations = [callbackRequired, descriptionRequired];

    constructor(commandsDir: string, language: NoCliLanguageType) {
        this.commandsDir = commandsDir;
        this._suffix = language === "TypeScript" ? "ts" : "js";
        this.readFiles()
    }

    private readFiles() {
        const validations = this._syntaxValidations;
        const files = getAllFiles(this.commandsDir);

        for (const file of files) {
            const commandProperty = file.split(/[/\\]/).pop()!.split(".");
            const commandName = commandProperty[0];
            const commandSuffix = commandProperty[1];
            if (commandSuffix !== this._suffix) continue;
            const commandObject: ICommand = this._suffix === "js"
                ? require(file)
                : import(file);

            const command = new Command(commandName, commandObject);

            for (const validation of validations) validation(command)

            this.commands.set(command.commandName, command);
        }
        const noCommands = this.commands.size === 0;
        const isOneOnly = this.commands.size === 1;
        log("NoCliHandler", "info", noCommands ? "No commands found" : `Loaded ${this.commands.size} command${isOneOnly ? "" : "s"}`);
    }

    async importFile(filePath: string) {
        const file = await (import(filePath));
        return file?.default;
    }

    async messageListener(client: Client) {
        const prefix = '!';

        const validations = this._runTimeValidations;

        client.on("messageCreate", (message) => {
            const { author, content } = message;
            if (author.bot) return;
            if (!content.startsWith(prefix)) return;

            const args = content.split(/\s+/);
            const commandName = args.shift()?.substring(1).toLowerCase();
            if (!commandName) return;
            const command = this.commands.get(commandName);
            if (!command) return;

            const usage = { client, message, args, text: args.join(" ") }

            for (const validation of validations) {
                if (!validation(command, usage, prefix)) return;
            }

            const { callback } = command.commandObject;

            callback(usage);
        })
    }
}

export default CommandHandler