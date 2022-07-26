// Default import
import { Client, CommandInteraction, Message, InteractionReplyOptions, GuildMember } from "discord.js";
import { CommandCallbackOptions, ICommand, NoCliHandlerOptions, NoCliLanguageType, NoCliRuntimeValidationType, NoCliSyntaxValidationType } from "../types";
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

                const { type: commandType, testOnly, description, delete: del, aliases = [], init = () => {} } = commandObject;

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
                            const showFullErrorLog = this._debugging ? this._debugging.showFullErrorLog : false;
                            handleError(err, showFullErrorLog, command.commandName);
                        })
                };

                await init(this._instance.client, this._instance)

                this.commands.set(command.commandName, command);

                if (commandType === "SLASH" || commandType === "BOTH") {
                    const options = commandObject.options || this._slashCommands.createOptions(commandObject);

                    if (testOnly) {
                        for (const guildId of this._instance.testServers) {
                            this._slashCommands.create(commandName, description, options ?? [], guildId);
                        }
                    } else this._slashCommands.create(commandName, description, options ?? []);
                }

                if (commandType !== "SLASH") {
                    const names = [command.commandName, ...aliases];
                    for (const name of names) this.commands.set(name, command);
                }
            } catch (err) {
                const showFullErrorLog = this._debugging
                    ? this._debugging.showFullErrorLog
                    : false;

                handleError(err, showFullErrorLog, commandName);
            }
        }
        const noCommands = this.commands.size === 0;
        const isOneOnly = this.commands.size === 1;
        log("NoCliHandler", "info", noCommands ? "No commands found" : `Loaded ${this.commands.size} command${isOneOnly ? "" : "s"}`);
    }

    private async runCommand(commandName: string, args: string[], message: Message | null, interaction: CommandInteraction | null) {
        const command = this.commands.get(commandName);
        if (!command) {
            if (interaction) interaction.reply({
                content: `This command is either deleted or is improperly registered`,
                ephemeral: true,
            });
            return
        };

        const usage: CommandCallbackOptions = {
            client: this._instance.client,
            message,
            interaction,
            args,
            text: args.join(" "),
            guild: message ? message.guild : interaction!.guild,
            member: message ? message.member : interaction!.member as GuildMember,
            user: message ? message.author : interaction!.user,
            channel: message ? message.channel : interaction!.channel,
        };

        if (message && command.commandObject.type === "SLASH") return;

        for (const validation of this._validations) {
            const valid = await validation.then(validate => validate(command, usage, message ? this._defaultPrefix : '/'));
            if (!valid) return;
        }

        try {
            const { deferReply = false, callback, ephemeralReply = false } = command.commandObject;
            if (deferReply && interaction) await interaction.deferReply({ ephemeral: ephemeralReply })
            return { response: await callback(usage), deferReply, ephemeralReply };
        } catch (err) {
            const showFullErrorLog = this._debugging ? this._debugging.showFullErrorLog : false;
            handleError(err as any, showFullErrorLog);
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
            
            const res = await this.runCommand(commandName, args, message, null);
            if (res) message.reply(res.response).catch(() => {})
        });
    }

    private async interactionListener(client: Client) {
        client.on("interactionCreate", async interaction => {

            if (!interaction.isChatInputCommand()) return;

            const args = interaction.options.data.map(({ value }) => String(value));

            const res = await this.runCommand(interaction.commandName, args, null, interaction);
            if (res) res.deferReply
                ? interaction.followUp(res.response).catch(() => {})
                : typeof res.response === "string"
                    ? interaction.reply({ content: res.response, ephemeral: res.ephemeralReply }).catch(() => {})
                    : interaction.reply(res.response).catch(() => {});
            
        });
    }
}

export default CommandHandler