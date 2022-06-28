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
var __exportStar = (this && this.__exportStar) || function(m, exports) {
    for (var p in m) if (p !== "default" && !Object.prototype.hasOwnProperty.call(exports, p)) __createBinding(exports, m, p);
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
// <---- EXPORTS ---->
// Functions
__exportStar(require("./functions/log"), exports);
__exportStar(require("./functions/handle-error"), exports);
// Types
__exportStar(require("./types"), exports);
// Classes
__exportStar(require("./command-handler/Command"), exports);
__exportStar(require("./command-handler/SlashCommands"), exports);
// Errors
__exportStar(require("./errors/NoCliCommandError"), exports);
__exportStar(require("./errors/NoCliHandlerError"), exports);
// <---- IMPORTS ---->
const discord_js_1 = __importDefault(require("discord.js"));
const CommandHandler_1 = __importDefault(require("./command-handler/CommandHandler"));
const NoCliHandlerError_1 = __importDefault(require("./errors/NoCliHandlerError"));
const mongoose_1 = __importDefault(require("mongoose"));
const log_1 = require("./functions/log");
const handle_error_1 = __importDefault(require("./functions/handle-error"));
const show_intro_banner_1 = __importDefault(require("./functions/show-intro-banner"));
const is_correct_version_1 = __importDefault(require("./functions/is-correct-version"));
class NoCliHandler {
    _options;
    _version = 'v1.0.33';
    _testServers = [];
    _botOwners = [];
    _configuration;
    _language;
    _debugging;
    _clientVersion;
    _showBanner = true;
    _commands = new Map();
    _defaultPrefix = "!";
    constructor(options) {
        this._options = options;
        this._configuration = options.configuration;
        this._debugging = options.debugging;
        this._language = options.language;
        this._clientVersion = options.clientVersion;
        if (this._options.testServers)
            this._testServers = this._options.testServers;
        if (this._options.botOwners)
            this._botOwners = this._options.botOwners;
        if (this._configuration.defaultPrefix)
            this._defaultPrefix = this._configuration.defaultPrefix;
        if (this._debugging && this._debugging.showBanner !== undefined)
            this._showBanner = this._debugging.showBanner;
        try {
            if (this._showBanner)
                (0, show_intro_banner_1.default)(this._version);
            if (!this._clientVersion)
                throw new NoCliHandlerError_1.default("Client version is required");
            if (!(0, is_correct_version_1.default)(this._clientVersion))
                throw new NoCliHandlerError_1.default("Please install Discord.JS version " + discord_js_1.default.version);
            if (!this._language || (this._language !== "JavaScript" && this._language !== "TypeScript"))
                throw new NoCliHandlerError_1.default("Invalid language specified");
            if (!this._options.client)
                throw new NoCliHandlerError_1.default("No client provided");
            this._options.client
                .setMaxListeners(Infinity)
                .on("ready", client => {
                (0, log_1.log)("NoCliHandler", "info", `Your bot ${client.user.tag} is up and running`);
                if (this._configuration.commandsDir) {
                    const commandHandlerInstance = new CommandHandler_1.default(this, this._configuration.commandsDir, this._language);
                    this._commands = commandHandlerInstance.commands;
                }
                else
                    (0, log_1.log)("NoCliHandlerWarning", "warn", "E1: No commands directory provided, you will have to handle the commands yourself");
                this._options.mongoDB !== undefined
                    ? this.connectToMongoDB(this._options.mongoDB)
                    : (0, log_1.log)("NoCliHandlerWarning", "warn", "-");
            });
        }
        catch (err) {
            const error = err;
            const showFullErrorLog = this._debugging !== undefined
                ? this._debugging.showFullErrorLog
                : false;
            (0, handle_error_1.default)(error, showFullErrorLog);
        }
    }
    get client() { return this._options.client; }
    get testServers() { return this._testServers; }
    get botOwners() { return this._botOwners; }
    get defaultPrefix() { return this._defaultPrefix; }
    get debug() { return this._debugging; }
    get commands() { return this._commands; }
    connectToMongoDB(mongoDB) {
        const options = mongoDB.options;
        mongoose_1.default.connect(mongoDB.uri, options ? options : { keepAlive: true }, (err) => err
            ? (0, log_1.log)("NoCliHandlerWarning", "warn", "Error connecting to MongoDB: " + err)
            : (0, log_1.log)("NoCliHandler", "info", "Connected to MongoDB"));
    }
}
exports.default = NoCliHandler;
