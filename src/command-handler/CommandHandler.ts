// Default import
import { Client, CommandInteraction, Message, InteractionReplyOptions, GuildMember, InteractionType, AutocompleteInteraction } from "discord.js";
import { cooldownTypesArray, CommandCallbackOptions, ICommand, NoCliCommandType, NoCliHandlerOptions, NoCliLanguageType, NoCliRuntimeValidationType, NoCliSyntaxValidationType, NoCliCommandCooldown, NoCliCooldownKeyOptions, NoCliCooldownType, NoCliCooldownOptions } from "../types";
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
        const { debug, defaultPrefix } = instance;
        this.commandsDir = commandsDir;
        this._suffix = language === "TypeScript" ? "ts" : "js";
        this._debugging = debug;
        this._defaultPrefix = defaultPrefix;
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

                if (commandType === NoCliCommandType.Slash || commandType === NoCliCommandType.Both) {
                    const options = commandObject.options || this._slashCommands.createOptions(commandObject);

                    if (testOnly) {
                        for (const guildId of this._instance.testServers) {
                            this._slashCommands.create(commandName, description, options ?? [], guildId);
                        }
                    } else this._slashCommands.create(commandName, description, options ?? []);
                }

                if (commandType !== NoCliCommandType.Slash) {
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

    private async runCommand(command: Command, args: string[], message: Message | null, interaction: CommandInteraction | null) {
        const { callback, type, cooldowns, deferReply = false, reply = false } = command.commandObject;

        if (message && type === NoCliCommandType.Slash) return;

        const guild = message ? message.guild : interaction!.guild;
        const member = message ? message.member : interaction!.member as GuildMember;
        const user = message ? message.author : interaction!.user;

        const usage: CommandCallbackOptions = {
            client: this._instance.client,
            message,
            interaction,
            args,
            text: args.join(" "),
            guild,
            member,
            user,
            channel: message ? message.channel : interaction!.channel,
            cancelCooldown: () => {},
            updateCooldown: () => {}
        };

        for (const validation of this._validations) {
            // @ts-ignore
            const valid = await validation.then(validate => validate(command, usage, message ? this._defaultPrefix : '/'));
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
            // @ts-ignore
            return { response: await callback(usage), deferReply, reply }
        } catch (err) {
            const showFullErrorLog = this._debugging ? this._debugging.showFullErrorLog : false;
            handleError(err as any, showFullErrorLog);
        }
    }

    /** Handles autocomplete interaction */
    private async handleAutocomplete(interaction: AutocompleteInteraction) {
        const command = this.commands.get(interaction.commandName);
        if (!command) return;

        const { autocomplete } = command.commandObject
        if (!autocomplete) return;

        const focusedOption = interaction.options.getFocused(true);
        const choices = await autocomplete(interaction, command, focusedOption.name);

        const filtered = choices.filter((choice) => choice.toLowerCase().startsWith(focusedOption.value.toLowerCase()));

        await interaction.respond(filtered.map(choice => ({ name: choice, value: choice })));
    }

    private async messageListener(client: Client) {
        client.on("messageCreate", async (message) => {
            const { author, content } = message;
            if (author.bot) return;
            if (!content.startsWith(this._defaultPrefix)) return;

            const args = content.split(/\s+/);
            const commandName = args.shift()
                ?.substring(this._defaultPrefix.length)
                .toLowerCase();
            if (!commandName) return;

            const command = this.commands.get(commandName);
            if (!command) return;
            
            const res = await this.runCommand(command, args, message, null);
            if (!res) return;

            const { response, reply } = res;
            
            if (reply) message.reply(response).catch(() => {});
            else message.channel.send(response).catch(() => {});
        });
    }

    private async interactionListener(client: Client) {
        client.on("interactionCreate", async interaction => {

            if (interaction.type === InteractionType.ApplicationCommandAutocomplete) {
                this.handleAutocomplete(interaction);
                return
            }

            if (interaction.type !== InteractionType.ApplicationCommand) return;

            const args = interaction.options.data.map(({ value }) => String(value));

            const command = this.commands.get(interaction.commandName);
            if (!command) return;

            const res = await this.runCommand(command, args, null, interaction);
            if (!res) return;

            const { response, deferReply } = res;

            if (deferReply) interaction.followUp(response).catch(() => {});
            else interaction.reply(response).catch(() => {});
        });
    }
}

export default CommandHandler