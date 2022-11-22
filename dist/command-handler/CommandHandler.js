"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const types_1 = require("../types");
const log_1 = require("../functions/log");
const get_all_files_1 = __importDefault(require("../util/get-all-files"));
const Command_1 = __importDefault(require("./Command"));
const handle_error_1 = __importDefault(require("../functions/handle-error"));
const SlashCommands_1 = __importDefault(require("./SlashCommands"));
const path_1 = __importDefault(require("path"));
const import_file_1 = __importDefault(require("../util/import-file"));
const ChannelCommands_1 = __importDefault(require("./ChannelCommands"));
const CustomCommands_1 = __importDefault(require("./CustomCommands"));
const DisabledCommands_1 = __importDefault(require("./DisabledCommands"));
const PrefixHandler_1 = __importDefault(require("./PrefixHandler"));
/** The nocli-handler.js command handler responsible for handling actions related to commands */
class CommandHandler {
    commands = new Map();
    commandsDir;
    _suffix;
    _debugging;
    _instance;
    _slashCommands;
    _channelCommands = new ChannelCommands_1.default();
    _customCommands = new CustomCommands_1.default(this);
    _disabledCommands = new DisabledCommands_1.default();
    _prefixes;
    _validations = this.getValidations(path_1.default.join(__dirname, `./validations`, 'runtime'));
    get channelCommands() { return this._channelCommands; }
    get customCommands() { return this._customCommands; }
    get slashCommands() { return this._slashCommands; }
    get prefixHandler() { return this._prefixes; }
    get disabledCommands() { return this._disabledCommands; }
    constructor(instance, commandsDir, language) {
        const { debug } = instance;
        this.commandsDir = commandsDir;
        this._suffix = language === "TypeScript" ? "ts" : "js";
        this._debugging = debug;
        this._instance = instance;
        this._prefixes = new PrefixHandler_1.default(this._instance);
        this._slashCommands = new SlashCommands_1.default(instance.client, this._debugging ? this._debugging.showFullErrorLog : undefined);
        this._validations = [
            ...this._validations,
            ...this.getValidations(instance.validations?.runtime)
        ];
        this.readFiles();
    }
    /**
     * Gets the validations from a folder
     * @param {string} folder The path to the validation folder
     * @returns {Promise<T>[]}
     */
    getValidations(folder) {
        if (!folder)
            return [];
        const validations = (0, get_all_files_1.default)(folder)
            .map(filePath => (0, import_file_1.default)(filePath).then((file) => file));
        return validations;
    }
    /** Reads the files from the commands directory */
    async readFiles() {
        try {
            const defaultCommandsFolder = path_1.default.join(__dirname, "./commands");
            const defaultCommands = (0, get_all_files_1.default)(defaultCommandsFolder);
            // Separate default commands with other commands (for importing)
            const validations = [
                ...this.getValidations(path_1.default.join(__dirname, `./validations`, 'syntax')),
                ...this.getValidations(this._instance.validations?.syntax)
            ];
            const files = (0, get_all_files_1.default)(this.commandsDir);
            for (const file of [...defaultCommands, ...files]) {
                const isDefaultCommand = file.includes(defaultCommandsFolder);
                const split = file.split(/[\/\\]/g);
                const commandProperty = split.pop().split(".");
                const categoryName = split[split.length - 2];
                const commandName = commandProperty[0];
                const commandSuffix = commandProperty[1];
                if (commandSuffix !== this._suffix)
                    continue;
                try {
                    const commandObject = this._suffix === "js" && !isDefaultCommand
                        ? require(file)
                        : await (0, import_file_1.default)(file);
                    let { type: commandType, testOnly, description, delete: del, aliases = [], init = () => { } } = commandObject;
                    if (typeof commandType === "string" && types_1.NoCliCommandTypeArray.includes(commandType))
                        commandType = types_1.NoCliCommandType[commandType];
                    const command = new Command_1.default(this._instance, commandName, commandObject, { isDefaultCommand });
                    if (del || (this._instance.disabledDefaultCommands.includes(commandName.toLowerCase()) && command.isDefaultCommand)) {
                        if (testOnly) {
                            for (const guildId of this._instance.testServers) {
                                this._slashCommands.delete(commandName, guildId);
                            }
                        }
                        else {
                            this._slashCommands.delete(commandName);
                        }
                        continue;
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
                            const aliasCommand = new Command_1.default(this._instance, commandName, commandObject, { isAlias: true, categoryName });
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
            }
            const noCommands = this.commands.size === 0;
            const isOneOnly = this.commands.size === 1;
            (0, log_1.log)("NoCliHandler", "info", noCommands ? "No commands found" : `Loaded ${this.commands.size} command${isOneOnly ? "" : "s"}`);
        }
        catch (err) {
            const showFullErrorLog = this._debugging
                ? this._debugging.showFullErrorLog
                : false;
            (0, handle_error_1.default)(err, showFullErrorLog);
        }
    }
    /**
     * Checks if the specified object is a Command instance
     * @param {unknown} object The object to check
     * @returns {object is Command}
     */
    isCommand(object) {
        return object instanceof Object && Object.prototype.hasOwnProperty.call(object, "callback") && Object.prototype.hasOwnProperty.call(object, "type");
    }
    /**
     * Runs the Command instance
     * @param {Command} command The command instance
     * @param {string[]} args The command arguments
     * @param {Message | null} message The Message instance
     * @param {CommandInteraction | null} interaction  The CommandInteraction instance
     * @returns
     */
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
            const valid = await validation.then(async (validate) => await validate(command, usage, message ? this._prefixes.get(guild?.id) : '/'));
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
            return { response: await callback(usage), deferReply, reply };
        }
        catch (err) {
            const showFullErrorLog = this._debugging ? this._debugging.showFullErrorLog : false;
            (0, handle_error_1.default)(err, showFullErrorLog);
        }
    }
}
exports.default = CommandHandler;
