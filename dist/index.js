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
__exportStar(require("./util/Cooldowns"), exports);
// Errors
__exportStar(require("./errors/NoCliCommandError"), exports);
__exportStar(require("./errors/NoCliHandlerError"), exports);
// <---- IMPORTS ---->
const discord_js_1 = __importDefault(require("discord.js"));
const CommandHandler_1 = __importDefault(require("./command-handler/CommandHandler"));
const Cooldowns_1 = __importDefault(require("./util/Cooldowns"));
const NoCliHandlerError_1 = __importDefault(require("./errors/NoCliHandlerError"));
const mongoose_1 = __importDefault(require("mongoose"));
const log_1 = require("./functions/log");
const handle_error_1 = __importDefault(require("./functions/handle-error"));
const show_intro_banner_1 = __importDefault(require("./functions/show-intro-banner"));
const is_correct_version_1 = __importDefault(require("./functions/is-correct-version"));
class NoCliHandler {
    _version = 'v1.0.9';
    _testServers = [];
    _botOwners = [];
    _showBanner = true;
    _commands = new Map();
    _cooldowns;
    _defaultPrefix = "!";
    _debugging;
    _client;
    constructor(options) {
        const { client, mongoDB, clientVersion, configuration, cooldownConfig = {}, debugging = {}, botOwners = [], testServers = [], language } = options;
        this._client = client;
        this._debugging = debugging;
        this._testServers = testServers;
        this._botOwners = botOwners;
        this._cooldowns = new Cooldowns_1.default({
            instance: this,
            ...cooldownConfig
        });
        if (configuration.defaultPrefix)
            this._defaultPrefix = configuration.defaultPrefix;
        if (debugging && debugging.showBanner !== undefined)
            this._showBanner = debugging.showBanner;
        try {
            if (this._showBanner)
                (0, show_intro_banner_1.default)(this._version);
            if (!clientVersion)
                throw new NoCliHandlerError_1.default("Client version is required");
            if (!(0, is_correct_version_1.default)(clientVersion))
                throw new NoCliHandlerError_1.default("Please install Discord.JS version " + discord_js_1.default.version);
            if (!language || (language !== "JavaScript" && language !== "TypeScript"))
                throw new NoCliHandlerError_1.default("Invalid language specified");
            if (!client)
                throw new NoCliHandlerError_1.default("No client provided");
            client
                .setMaxListeners(Infinity)
                .on("ready", async (client) => {
                (0, log_1.log)("NoCliHandler", "info", `Your bot ${client.user.tag} is up and running`);
                if (!botOwners.length) {
                    await client.application.fetch();
                    const { owner } = client.application;
                    if (owner) {
                        // @ts-ignore
                        if (owner.members !== undefined) {
                            // @ts-ignore
                            const owners = owner.members.map(member => member.id);
                            this._botOwners.push(...owners);
                            (0, log_1.log)("NoCliHandler", "info", `Auto set IDs "${owners.join('", "')}" as default owners`);
                        }
                        else {
                            this._botOwners.push(owner.id);
                            (0, log_1.log)("NoCliHandler", "info", `Auto set ID "${owner.id}" as a default owner`);
                        }
                    }
                }
                if (configuration.commandsDir) {
                    const commandHandlerInstance = new CommandHandler_1.default(this, configuration.commandsDir, language);
                    this._commands = commandHandlerInstance.commands;
                }
                else
                    (0, log_1.log)("NoCliHandlerWarning", "warn", "No commands directory provided, you will have to handle the commands yourself");
                mongoDB !== undefined
                    ? this.connectToMongoDB(mongoDB)
                    : (0, log_1.log)("NoCliHandlerWarning", "warn", "MongoDB URI not found. Some features will not work!");
            });
        }
        catch (err) {
            const error = err;
            const showFullErrorLog = debugging !== undefined
                ? debugging.showFullErrorLog
                : false;
            (0, handle_error_1.default)(error, showFullErrorLog);
        }
    }
    get client() { return this._client; }
    get testServers() { return this._testServers; }
    get botOwners() { return this._botOwners; }
    get defaultPrefix() { return this._defaultPrefix; }
    get debug() { return this._debugging; }
    get commands() { return this._commands; }
    get cooldowns() { return this._cooldowns; }
    connectToMongoDB(mongoDB) {
        const options = mongoDB.options;
        mongoose_1.default.connect(mongoDB.uri, options ? options : { keepAlive: true, directConnection: true }, (err) => err
            ? (0, log_1.log)("NoCliHandlerWarning", "warn", "Error connecting to MongoDB: " + err)
            : (0, log_1.log)("NoCliHandler", "info", "Connected to MongoDB"));
    }
}
exports.default = NoCliHandler;
