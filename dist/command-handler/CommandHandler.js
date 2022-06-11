"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const log_1 = require("../functions/log");
const get_all_files_1 = __importDefault(require("../util/get-all-files"));
const Command_1 = __importDefault(require("./Command"));
const handleError_1 = __importDefault(require("../functions/handleError"));
// Validation imports
const argument_count_1 = __importDefault(require("./validations/run-time/argument-count"));
const test_only_1 = __importDefault(require("./validations/run-time/test-only"));
const callback_required_1 = __importDefault(require("./validations/syntax/callback-required"));
const description_required_1 = __importDefault(require("./validations/syntax/description-required"));
const test_without_server_1 = __importDefault(require("./validations/syntax/test-without-server"));
class CommandHandler {
    commands = new Map();
    commandsDir;
    _suffix;
    _debugging;
    _defaultPrefix;
    _instance;
    _runTimeValidations = [argument_count_1.default, test_only_1.default];
    _syntaxValidations = [callback_required_1.default, description_required_1.default, test_without_server_1.default];
    constructor(instance, commandsDir, language) {
        this.commandsDir = commandsDir;
        this._suffix = language === "TypeScript" ? "ts" : "js";
        this._debugging = instance.debug;
        this._defaultPrefix = instance.defaultPrefix;
        this._instance = instance;
        this.readFiles();
    }
    async readFiles() {
        const validations = this._syntaxValidations;
        const files = (0, get_all_files_1.default)(this.commandsDir);
        for (const file of files) {
            const commandProperty = file.split(/[/\\]/).pop().split(".");
            const commandName = commandProperty[0];
            const commandSuffix = commandProperty[1];
            if (commandSuffix !== this._suffix)
                continue;
            const commandObject = this._suffix === "js"
                ? require(file)
                : await this.importFile(file);
            const command = new Command_1.default(this._instance, commandName, commandObject);
            try {
                for (const validate of validations)
                    validate(command);
            }
            catch (err) {
                const error = err;
                const showFullErrorLog = this._debugging !== undefined
                    ? this._debugging.showFullErrorLog
                    : false;
                (0, handleError_1.default)(error, showFullErrorLog);
            }
            this.commands.set(command.commandName, command);
        }
        const noCommands = this.commands.size === 0;
        const isOneOnly = this.commands.size === 1;
        (0, log_1.log)("NoCliHandler", "info", noCommands ? "No commands found" : `Loaded ${this.commands.size} command${isOneOnly ? "" : "s"}`);
    }
    async importFile(filePath) {
        const file = await (Promise.resolve().then(() => __importStar(require(filePath))));
        return file?.default;
    }
    async messageListener(client) {
        const prefix = this._defaultPrefix;
        const validations = this._runTimeValidations;
        client.on("messageCreate", (message) => {
            const { author, content } = message;
            if (author.bot)
                return;
            if (!content.startsWith(prefix))
                return;
            const args = content.split(/\s+/);
            const commandName = args.shift()?.substring(1).toLowerCase();
            if (!commandName)
                return;
            const command = this.commands.get(commandName);
            if (!command)
                return;
            const usage = { client, message, args, text: args.join(" "), guild: message.guild };
            for (const validation of validations) {
                if (!validation(command, usage, prefix))
                    return;
            }
            const { callback } = command.commandObject;
            callback(usage);
        });
    }
}
exports.default = CommandHandler;
