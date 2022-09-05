"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
// Default import
const discord_js_1 = require("discord.js");
const types_1 = require("../types");
const log_1 = require("../functions/log");
const get_all_files_1 = __importDefault(require("../util/get-all-files"));
const Command_1 = __importDefault(require("./Command"));
const handle_error_1 = __importDefault(require("../functions/handle-error"));
const SlashCommands_1 = __importDefault(require("./SlashCommands"));
const path_1 = __importDefault(require("path"));
const import_file_1 = __importDefault(require("../util/import-file"));
const NoCliCommandError_1 = __importDefault(require("../errors/NoCliCommandError"));
const ChannelCommands_1 = __importDefault(require("./ChannelCommands"));
const CustomCommands_1 = __importDefault(require("./CustomCommands"));
const DisabledCommands_1 = __importDefault(require("./DisabledCommands"));
class CommandHandler {
    commands = new Map();
    commandsDir;
    _suffix;
    _debugging;
    _defaultPrefix;
    _instance;
    _slashCommands;
    _channelCommands = new ChannelCommands_1.default();
    _customCommands = new CustomCommands_1.default(this);
    _disabledCommands = new DisabledCommands_1.default();
    _validations = this.getValidations('run-time');
    get channelCommands() { return this._channelCommands; }
    get customCommands() { return this._customCommands; }
    get slashCommands() { return this._slashCommands; }
    get disabledCommands() { return this._disabledCommands; }
    constructor(instance, commandsDir, language) {
        const { debug, defaultPrefix } = instance;
        this.commandsDir = commandsDir;
        this;
        this._suffix = language === "TypeScript" ? "ts" : "js";
        this._debugging = debug;
        this._defaultPrefix = defaultPrefix;
        this._instance = instance;
        this._slashCommands = new SlashCommands_1.default(instance.client, this._debugging ? this._debugging.showFullErrorLog : undefined);
        this.readFiles();
        this.messageListener(instance.client);
        this.interactionListener(instance.client);
    }
    getValidations(folder) {
        const validations = (0, get_all_files_1.default)(path_1.default.join(__dirname, `./validations/${folder}`))
            .map(filePath => (0, import_file_1.default)(filePath).then((file) => file));
        return validations;
    }
    async readFiles() {
        const defaultCommands = (0, get_all_files_1.default)(path_1.default.join(__dirname, "./commands"));
        // Separate default commands with other commands (for importing)
        let commandsCount = 0;
        const validations = this.getValidations('syntax');
        const files = (0, get_all_files_1.default)(this.commandsDir);
        for (const file of [...defaultCommands, ...files]) {
            const commandProperty = file.split(/[/\\]/).pop().split(".");
            const commandName = commandProperty[0];
            const commandSuffix = commandProperty[1];
            if (commandSuffix !== this._suffix)
                continue;
            try {
                const commandObject = this._suffix === "js" && commandsCount > defaultCommands.length
                    ? require(file)
                    : await (0, import_file_1.default)(file);
                let { type: commandType, testOnly, description, delete: del, aliases = [], init = () => { } } = commandObject;
                if (typeof commandType === "string" && types_1.NoCliCommandTypeArray.includes(commandType))
                    commandType = types_1.NoCliCommandType[commandType];
                const command = new Command_1.default(this._instance, commandName, commandObject, { isDefaultCommand: commandsCount < defaultCommands.length });
                if (del || (this._instance.disabledDefaultCommands.includes(commandName.toLowerCase()) && command.isDefaultCommand)) {
                    if (testOnly) {
                        for (const guildId of this._instance.testServers) {
                            this._slashCommands.delete(commandName, guildId);
                        }
                    }
                    else {
                        this._slashCommands.delete(commandName);
                    }
                    return;
                }
                ;
                for (const validation of validations) {
                    validation
                        .then((validate) => validate(command))
                        .catch(err => {
                        const showFullErrorLog = this._debugging ? this._debugging.showFullErrorLog : false;
                        (0, handle_error_1.default)(err, showFullErrorLog, command.commandName);
                    });
                }
                ;
                await init(this._instance.client, this._instance);
                this.commands.set(command.commandName, command);
                if (commandType === types_1.NoCliCommandType.Slash || commandType === types_1.NoCliCommandType.Both) {
                    const options = commandObject.options || this._slashCommands.createOptions(commandObject);
                    if (testOnly) {
                        for (const guildId of this._instance.testServers) {
                            this._slashCommands.create(commandName, description, options ?? [], guildId);
                        }
                    }
                    else
                        this._slashCommands.create(commandName, description, options ?? []);
                }
                if (commandType !== types_1.NoCliCommandType.Slash) {
                    const names = aliases;
                    // Sets a new Command for an alias
                    for (const name of names) {
                        const aliasCommand = new Command_1.default(this._instance, commandName, commandObject, { isAlias: true });
                        this.commands.set(name, aliasCommand);
                    }
                    ;
                }
            }
            catch (err) {
                const showFullErrorLog = this._debugging
                    ? this._debugging.showFullErrorLog
                    : false;
                (0, handle_error_1.default)(err, showFullErrorLog, commandName);
            }
            commandsCount += 1;
        }
        const noCommands = this.commands.size === 0;
        const isOneOnly = this.commands.size === 1;
        (0, log_1.log)("NoCliHandler", "info", noCommands ? "No commands found" : `Loaded ${this.commands.size} command${isOneOnly ? "" : "s"}`);
    }
    async runCommand(command, args, message, interaction) {
        const { callback, type, cooldowns, deferReply = false, reply = false } = command.commandObject;
        if (message && type === types_1.NoCliCommandType.Slash)
            return;
        const guild = message ? message.guild : interaction.guild;
        const member = message ? message.member : interaction.member;
        const user = message ? message.author : interaction.user;
        const channel = message ? message.channel : interaction.channel;
        const options = interaction ? interaction.options : null;
        const usage = {
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
            // @ts-ignore
            const valid = await validation.then(async (validate) => await validate(command, usage, message ? this._defaultPrefix : '/'));
            if (!valid)
                return;
        }
        if (cooldowns) {
            let cooldownType = 'global';
            for (const type of types_1.cooldownTypesArray) {
                if (cooldowns[type]) {
                    cooldownType = type;
                    break;
                }
            }
            const cooldownUsage = {
                cooldownType,
                userId: user.id,
                actionId: `command_${command.commandName}`,
                guildId: guild?.id,
                duration: cooldowns[cooldownType],
                errorMessage: cooldowns.errorMessage,
            };
            const result = this._instance.cooldowns.canRunAction(cooldownUsage);
            if (typeof result === 'string') {
                return { response: result, reply };
            }
            await this._instance.cooldowns.start(cooldownUsage);
            usage.cancelCooldown = () => {
                this._instance.cooldowns.cancelCooldown(cooldownUsage);
            };
            usage.updateCooldown = (expires) => {
                this._instance.cooldowns.updateCooldown(cooldownUsage, expires);
            };
        }
        try {
            if (deferReply)
                interaction
                    ? await interaction.deferReply({ ephemeral: deferReply === "ephemeral" })
                    : await message.channel.sendTyping();
            // @ts-ignore
            return { response: await callback(usage), deferReply, reply };
        }
        catch (err) {
            const showFullErrorLog = this._debugging ? this._debugging.showFullErrorLog : false;
            (0, handle_error_1.default)(err, showFullErrorLog);
        }
    }
    /** Handles autocomplete interaction */
    async handleAutocomplete(interaction) {
        const command = this.commands.get(interaction.commandName);
        if (!command)
            return;
        const { autocomplete } = command.commandObject;
        if (!autocomplete)
            return;
        const focusedOption = interaction.options.getFocused(true);
        const choices = await autocomplete(interaction, command, focusedOption.name);
        for (const choice of choices) {
            if (typeof choice !== "string")
                throw new NoCliCommandError_1.default("Some autocomplete options are not a string");
        }
        const filtered = choices.filter((choice) => choice.toLowerCase().startsWith(focusedOption.value.toLowerCase()));
        const editedFilter = [];
        let counter = 0;
        if (filtered.length > 25) {
            filtered.forEach(value => {
                if (counter === 25)
                    return;
                counter += 1;
                return editedFilter.push(value);
            });
        }
        else
            editedFilter.push(...filtered);
        await interaction.respond(editedFilter.map(choice => ({ name: choice, value: choice })));
    }
    async messageListener(client) {
        client.on("messageCreate", async (message) => {
            const { author, content } = message;
            if (author.bot)
                return;
            if (!content.startsWith(this._defaultPrefix))
                return;
            const args = content.split(/\s+/);
            const commandName = args.shift()
                ?.substring(this._defaultPrefix.length)
                .toLowerCase();
            if (!commandName)
                return;
            const command = this.commands.get(commandName);
            if (!command) {
                this._customCommands.run(commandName, message);
                return;
            }
            ;
            const res = await this.runCommand(command, args, message, null);
            if (!res)
                return;
            const { response, reply } = res;
            if (reply)
                message.reply(response).catch(() => { });
            else
                message.channel.send(response).catch(() => { });
        });
    }
    async interactionListener(client) {
        client.on("interactionCreate", async (interaction) => {
            if (interaction.type === discord_js_1.InteractionType.ApplicationCommandAutocomplete) {
                this.handleAutocomplete(interaction).catch((err) => {
                    if (err.name !== "NoCliCommandError")
                        return;
                    const showFullErrorLog = this._debugging ? this._debugging.showFullErrorLog : false;
                    (0, handle_error_1.default)(err, showFullErrorLog);
                });
                return;
            }
            if (interaction.type !== discord_js_1.InteractionType.ApplicationCommand)
                return;
            const args = interaction.options.data.map(({ value }) => String(value));
            const command = this.commands.get(interaction.commandName);
            if (!command) {
                this._customCommands.run(interaction.commandName, undefined, interaction);
                return;
            }
            ;
            const res = await this.runCommand(command, args, null, interaction);
            if (!res)
                return;
            const { response, deferReply } = res;
            if (deferReply)
                interaction.followUp(response).catch(() => { });
            else
                interaction.reply(response).catch(() => { });
        });
    }
}
exports.default = CommandHandler;
