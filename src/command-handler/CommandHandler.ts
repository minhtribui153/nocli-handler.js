// Default import
import { CommandInteraction, Message, GuildMember, CommandInteractionOptionResolver } from "discord.js";
import { cooldownTypesArray, CommandCallbackOptions, ICommand, NoCliCommandType, NoCliHandlerOptions, NoCliLanguageType, NoCliRuntimeValidationType, NoCliSyntaxValidationType, NoCliCooldownKeyOptions, NoCliCooldownType, NoCliCommandTypeArray } from "../types";
import { log } from "../functions/log";
import getAllFiles from "../util/get-all-files";
import NoCliHandler from "..";
import Command from "./Command";
import handleError from "../functions/handle-error";
import SlashCommands from "./SlashCommands";
import path from "path";
import importFile from "../util/import-file";
import ChannelCommands from "./ChannelCommands";
import CustomCommands from "./CustomCommands";
import DisabledCommands from "./DisabledCommands";
import PrefixHandler from "./PrefixHandler";

class CommandHandler {
    public commands: Map<string, Command> = new Map();
    public commandsDir: string;

    private _suffix: "js" | "ts";
    private _debugging: NoCliHandlerOptions["debugging"];
    private _instance: NoCliHandler;
    private _slashCommands: SlashCommands;
    private _channelCommands: ChannelCommands = new ChannelCommands();
    private _customCommands: CustomCommands = new CustomCommands(this);
    private _disabledCommands = new DisabledCommands();
    private _prefixes: PrefixHandler;
    private _validations = this.getValidations<NoCliRuntimeValidationType>(path.join(__dirname, `./validations`, 'runtime'));

    public get channelCommands() { return this._channelCommands }
    public get customCommands() { return this._customCommands }
    public get slashCommands() { return this._slashCommands }
    public get prefixHandler() { return this._prefixes }
    public get disabledCommands() { return this._disabledCommands }

    constructor(instance: NoCliHandler, commandsDir: string, language: NoCliLanguageType) {
        const { debug } = instance;
        this.commandsDir = commandsDir;
        this._suffix = language === "TypeScript" ? "ts" : "js";
        this._debugging = debug;
        this._instance = instance;
        this._prefixes = new PrefixHandler(this._instance)
        this._slashCommands = new SlashCommands(instance.client, this._debugging ? this._debugging.showFullErrorLog : undefined);
        this._validations = [
            ...this._validations,
            ...this.getValidations<NoCliRuntimeValidationType>(instance.validations?.runtime)
        ]
        this.readFiles();
    }

    private getValidations<T>(folder?: string) {
        if (!folder) return []
        const validations = getAllFiles(folder)
            .map(filePath => importFile<T>(filePath).then((file) => file))

        return validations;
    }

    private async readFiles() {
        try {
            const defaultCommandsFolder = path.join(__dirname, "./commands")
            const defaultCommands = getAllFiles(defaultCommandsFolder)
            // Separate default commands with other commands (for importing)
            const validations = [
                ...this.getValidations<NoCliSyntaxValidationType>(path.join(__dirname, `./validations`, 'syntax')),
                ...this.getValidations<NoCliSyntaxValidationType>(this._instance.validations?.syntax)
            ]
            const files = getAllFiles(this.commandsDir);

            for (const file of [...defaultCommands, ...files]) {
                const isDefaultCommand = file.includes(defaultCommandsFolder)
                const split = file.split(/[\/\\]/g);
                const commandProperty = split.pop()!.split(".");
                const categoryName = split[split.length - 2];
                const commandName = commandProperty[0];
                const commandSuffix = commandProperty[1];

                if (commandSuffix !== this._suffix) continue;
                
                try {
                    const commandObject = this._suffix === "js" && !isDefaultCommand
                        ? require(file) as ICommand
                        : await importFile<ICommand>(file);

                    let { type: commandType, testOnly, description, delete: del, aliases = [], init = () => {} } = commandObject;

                    if (typeof commandType === "string" && NoCliCommandTypeArray.includes(commandType)) commandType = NoCliCommandType[commandType];

                    const command = new Command(this._instance, commandName, commandObject, { isDefaultCommand });

                    if (del || (this._instance.disabledDefaultCommands.includes(commandName.toLowerCase()) && command.isDefaultCommand)) {
                        if (testOnly) {
                            for (const guildId of this._instance.testServers) {
                                this._slashCommands.delete(commandName, guildId);
                            }
                        } else {
                            this._slashCommands.delete(commandName)
                        }
                        continue;
                    };

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
                    
                    if (commandType === NoCliCommandType.Slash || commandType === NoCliCommandType.Both) {
                        const options = commandObject.options || this._slashCommands.createOptions(commandObject);

                        if (testOnly) {
                            for (const guildId of this._instance.testServers) {
                                this._slashCommands.create(commandName, description, options ?? [], guildId);
                            }
                        } else this._slashCommands.create(commandName, description, options ?? []);
                    }

                    if (commandType !== NoCliCommandType.Slash) {
                        const names = aliases;
                        // Sets a new Command for an alias
                        for (const name of names) {
                            const aliasCommand = new Command(this._instance, commandName, commandObject, { isAlias: true, categoryName });
                            this.commands.set(name, aliasCommand)
                        };
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
        } catch (err) {
            const showFullErrorLog = this._debugging
                ? this._debugging.showFullErrorLog
                : false;

            handleError(err, showFullErrorLog);
        }
        
    }

    public isCommand(object: unknown): object is Command {
        return Object.prototype.hasOwnProperty.call(object, "callback") && Object.prototype.hasOwnProperty.call(object, "type");
    }

    public async runCommand(command: Command, args: string[], message: Message | null, interaction: CommandInteraction | null) {
        const { callback, type, cooldowns, deferReply = false, reply = false } = command.commandObject;

        if (message && type === NoCliCommandType.Slash) return;

        const guild = message ? message.guild : interaction!.guild;
        const member = message ? message.member : interaction!.member as GuildMember;
        const user = message ? message.author : interaction!.user;
        const channel = message ? message.channel : interaction!.channel
        const options = interaction ? interaction.options as CommandInteractionOptionResolver : null;

        const usage: CommandCallbackOptions = {
            instance: command.instance,
            client: this._instance.client,
            message,
            interaction,
            args,
            text: args.join(" "),
            guild,
            member,
            user,
            channel,
            options,
            cancelCooldown: () => { },
            updateCooldown: () => { }
        };

        for (const validation of this._validations) {
            const valid = await validation.then(async validate => await validate(command, usage, message ? this._prefixes.get(guild?.id) : '/'));
            if (!valid) return;
        }

        if (cooldowns) {
            let cooldownType: NoCliCooldownType = 'global';

            for (const type of cooldownTypesArray) {
                if (cooldowns[type]) {
                    cooldownType = type;
                    break;
                }
            }

            const cooldownUsage: NoCliCooldownKeyOptions = {
                cooldownType,
                userId: user.id,
                actionId: `command_${command.commandName}`,
                guildId: guild?.id,
                duration: cooldowns[cooldownType],
                errorMessage: cooldowns.errorMessage,
            }

            const result = this._instance.cooldowns.canRunAction(cooldownUsage);

            if (typeof result === 'string') {
                return { response: result, reply };
            }

            await this._instance.cooldowns.start(cooldownUsage);

            usage.cancelCooldown = () => {
               this._instance.cooldowns.cancelCooldown(cooldownUsage);
            }
            usage.updateCooldown = (expires) => {
                this._instance.cooldowns.updateCooldown(cooldownUsage, expires);
            }

        }

        try {
            if (deferReply) interaction
                ? await interaction.deferReply({ ephemeral: deferReply === "ephemeral" })
                : await message!.channel.sendTyping()
            return { response: await callback(usage), deferReply, reply }
        } catch (err) {
            const showFullErrorLog = this._debugging ? this._debugging.showFullErrorLog : false;
            handleError(err as any, showFullErrorLog);
        }
    }
}

export default CommandHandler