// Default import
import { Client } from "discord.js";
import { ICommand, NoCliHandlerOptions, NoCliLanguageType } from "../types";
import { log } from "../functions/log";
import getAllFiles from "../util/get-all-files";
import NoCliHandler from "..";
import Command from "./Command";
import handleError from "../functions/handleError";

// Validation imports
import argumentCount from "./validations/run-time/argument-count";
import testOnly from "./validations/run-time/test-only";

import callbackRequired from "./validations/syntax/callback-required";
import descriptionRequired from "./validations/syntax/description-required";
import testWithoutServer from "./validations/syntax/test-without-server";


class CommandHandler {
    public commands: Map<string, Command> = new Map();
    public commandsDir: string;

    private _suffix: "js" | "ts";
    private _debugging: NoCliHandlerOptions["debugging"];
    private _defaultPrefix: string;
    private _instance: NoCliHandler;
    private _runTimeValidations = [argumentCount, testOnly];
    private _syntaxValidations = [callbackRequired, descriptionRequired, testWithoutServer];

    constructor(instance: NoCliHandler, commandsDir: string, language: NoCliLanguageType) {
        this.commandsDir = commandsDir;
        this._suffix = language === "TypeScript" ? "ts" : "js";
        this._debugging = instance.debug;
        this._defaultPrefix = instance.defaultPrefix;
        this._instance = instance;
        this.readFiles()
    }

    private async readFiles() {
        const validations = this._syntaxValidations;
        const files = getAllFiles(this.commandsDir);

        for (const file of files) {
            const commandProperty = file.split(/[/\\]/).pop()!.split(".");
            const commandName = commandProperty[0];
            const commandSuffix = commandProperty[1];
            if (commandSuffix !== this._suffix) continue;
            const commandObject: ICommand = this._suffix === "js"
                ? require(file)
                : await this.importFile(file);

            const command = new Command(this._instance, commandName, commandObject);

            try {
                for (const validate of validations) validate(command);
            } catch (err) {
                const error = err as any;
                const showFullErrorLog = this._debugging !== undefined
                    ? this._debugging.showFullErrorLog
                    : false;

                handleError(error, showFullErrorLog);
            }

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
        const prefix = this._defaultPrefix;

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

            const usage = { client, message, args, text: args.join(" "), guild: message.guild };

            for (const validation of validations) {
                if (!validation(command, usage, prefix)) return;
            }

            const { callback } = command.commandObject;

            callback(usage);
        })
    }
}

export default CommandHandler