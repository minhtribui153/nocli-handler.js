// Default import
import { Client, CommandInteraction, Message, InteractionReplyOptions } from "discord.js";
import { ICommand, NoCliHandlerOptions, NoCliLanguageType, NoCliRuntimeValidationType, NoCliSyntaxValidationType } from "../types";
import { log } from "../functions/log";
import getAllFiles from "../util/get-all-files";
import NoCliHandler from "..";
import Command from "./Command";
import handleError from "../functions/handle-error";
import SlashCommands from "./SlashCommands";
import path from "path";
import importFile from "../util/import-file";


class CommandHandler {
    public commands: Map<string, Command> = new Map();
    public commandsDir: string;

    private _suffix: "js" | "ts";
    private _debugging: NoCliHandlerOptions["debugging"];
    private _defaultPrefix: string;
    private _instance: NoCliHandler;
    private _slashCommands: SlashCommands;
    private _validations = this.getValidations<NoCliRuntimeValidationType>('run-time');


    constructor(instance: NoCliHandler, commandsDir: string, language: NoCliLanguageType) {
        this.commandsDir = commandsDir;
        this._suffix = language === "TypeScript" ? "ts" : "js";
        this._debugging = instance.debug;
        this._defaultPrefix = instance.defaultPrefix;
        this._instance = instance;
        this._slashCommands = new SlashCommands(instance.client, this._debugging ? this._debugging.showFullErrorLog : undefined);
        this.readFiles()
        this.messageListener(instance.client);
        this.interactionListener(instance.client);
    }

    private getValidations<T>(folder: string) {
        const validations = getAllFiles(path.join(__dirname, `./validations/${folder}`))
            .map(filePath => importFile<T>(filePath).then((file) => file))

        return validations;
    }

    private async readFiles() {
        const validations = this.getValidations<NoCliSyntaxValidationType>('syntax');
        const files = getAllFiles(this.commandsDir);

        for (const file of files) {
            const commandProperty = file.split(/[/\\]/).pop()!.split(".");
            const commandName = commandProperty[0];
            const commandSuffix = commandProperty[1];

            if (commandSuffix !== this._suffix) continue;
            
            try {
                const commandObject = this._suffix === "js"
                    ? require(file) as ICommand
                    : await importFile<ICommand>(file);

                const { slash, testOnly, description, delete: del } = commandObject;

                if (del) {
                    if (testOnly) {
                        for (const guildId of this._instance.testServers) {
                            this._slashCommands.delete(commandName, guildId);
                        }
                    } else {
                        this._slashCommands.delete(commandName)
                    }
                    continue
                };
    
                const command = new Command(this._instance, commandName, commandObject);

                for (const validation of validations) {
                    validation
                        .then((validate) => validate(command))
                        .catch(err => {
                            const error = err as any;
                            const showFullErrorLog = this._debugging !== undefined
                                ? this._debugging.showFullErrorLog
                                : false;

                            handleError(error, showFullErrorLog);
                        })
                };

                

                if (slash === true || slash === 'both') {
                    const options = commandObject.options || this._slashCommands.createOptions(commandObject);

                    if (testOnly === true) {
                        for (const guildId of this._instance.testServers) {
                            this._slashCommands.create(commandName, description, options ?? [], guildId);
                        }
                    } else {
                        this._slashCommands.create(commandName, description, options ?? []);
                    }

                    if (slash !== true) {
                        this.commands.set(command.commandName, command);
                    }
                }
                
                this.commands.set(command.commandName, command);
            } catch (err) {
                const error = err as any;
                const showFullErrorLog = this._debugging !== undefined
                    ? this._debugging.showFullErrorLog
                    : false;

                handleError(error, showFullErrorLog);
            }
        }
        const noCommands = this.commands.size === 0;
        const isOneOnly = this.commands.size === 1;
        log("NoCliHandler", "info", noCommands ? "No commands found" : `Loaded ${this.commands.size} command${isOneOnly ? "" : "s"}`);
    }

    private async runCommand(commandName: string, args: string[], message: Message | null, interaction: CommandInteraction | null) {

        const command = this.commands.get(commandName);
            if (!command) return;

            const usage = {
                client: this._instance.client,
                message,
                interaction,
                args,
                text: args.join(" "),
                guild: message ? message.guild : interaction!.guild,
            };

            if (message && command.commandObject.slash === true) return;

            for (const validation of this._validations) {
                const valid = validation
                    .then(validate => validate(command, usage, message ? this._defaultPrefix : '/'))
                    .catch(err => {
                        const error = err as any;
                        const showFullErrorLog = this._debugging !== undefined
                            ? this._debugging.showFullErrorLog
                            : false;

                        handleError(error, showFullErrorLog);
                    });
                if (!valid) return;
            }

            try {
                const { callback } = command.commandObject;
    
                return await callback(usage);
            } catch (err) {
                const error = err as any;
                const showFullErrorLog = this._debugging !== undefined
                    ? this._debugging.showFullErrorLog
                    : false;

                handleError(error, showFullErrorLog);
            }
    }

    private async messageListener(client: Client) {
        client.on("messageCreate", async message => {
            const { author, content } = message;
            if (author.bot) return;
            if (!content.startsWith(this._defaultPrefix)) return;

            const args = content.split(/\s+/);
            const commandName = args.shift()
                ?.substring(this._defaultPrefix.length)
                .toLowerCase();
            if (!commandName) return;
            
            const response = await this.runCommand(commandName, args, message, null);
            if (response) message.reply(response).catch(() => {});
        });
    }

    private async interactionListener(client: Client) {
        client.on("interactionCreate", async interaction => {
            if (!interaction.isCommand()) return;

            const args = interaction.options.data.map(({ value }) => String(value));

            const response = await this.runCommand(interaction.commandName, args, null, interaction);
            if (response) interaction.reply(response).catch(() => {});
        });
    }
}

export default CommandHandler