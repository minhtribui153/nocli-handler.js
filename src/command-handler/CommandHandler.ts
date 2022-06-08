// Default import
import getAllFiles from "../util/get-all-files";
import Command from "./Command";
import { Client } from "discord.js";
import { CommandValidationCallbackType, ICommand } from "../types";

// Validation imports
import argumentCount from "./validations/argument-count";
import { log } from "../functions/log";


class CommandHandler {
    public commands: Map<string, Command> = new Map();
    public commandsDir: string;
    private validations: CommandValidationCallbackType<Command>[] = [argumentCount];

    constructor(commandsDir: string) {
        this.commandsDir = commandsDir;
        this.readFiles()
    }

    private readFiles() {
        const files = getAllFiles(this.commandsDir);

        for (const file of files) {
            const commandObject = require(file) as ICommand;
            let commandName = file.split(/[/\\]/).pop()!.split(".")[0];

            const command = new Command(commandName, commandObject);
            this.commands.set(command.commandName, command);
        }
        const noCommands = this.commands.size === 0;
        const isOneOnly = this.commands.size === 1;
        log("NoCliHandler", "info", noCommands ? "No commands found" : `Loaded ${this.commands.size} command${isOneOnly ? "" : "s"}`);
    }

    messageListener(client: Client) {
        const prefix = '!';

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

            for (const validation of this.validations) {
                if (!validation(command, usage, prefix)) return;
            }

            const { callback } = command.commandObject;

            callback(usage);
        })
    }
}

export default CommandHandler