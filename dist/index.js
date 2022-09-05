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
const CommandHandler_1 = __importDefault(require("./command-handler/CommandHandler"));
const Cooldowns_1 = __importDefault(require("./util/Cooldowns"));
const NoCliHandlerError_1 = __importDefault(require("./errors/NoCliHandlerError"));
const mongoose_1 = __importDefault(require("mongoose"));
const log_1 = require("./functions/log");
const handle_error_1 = __importDefault(require("./functions/handle-error"));
const show_intro_banner_1 = __importDefault(require("./functions/show-intro-banner"));
class NoCliHandler {
    _version = 'v1.1.1';
    _defaultPrefix = "!";
    _testServers;
    _botOwners;
    _disabledDefaultCommands;
    _mongoDBConnection = { connected: false, errMessage: "MongoDB URI not found" };
    _showBanner = true;
    _commands = new Map();
    _commandHandler;
    _emojiConfig;
    _cooldowns;
    _debugging;
    _client;
    constructor(options) {
        const { botOwners = [], client, configuration, cooldownConfig, debugging = {}, emojiConfig = {}, language, mongoDB, testServers = [], disabledDefaultCommands = [] } = options;
        this._client = client;
        this._debugging = debugging;
        this._testServers = testServers;
        this._emojiConfig = {
            success: emojiConfig.success || "",
            info: emojiConfig.info || "",
            enabled: emojiConfig.enabled || "",
            disabled: emojiConfig.disabled || "",
            error: emojiConfig.error || ""
        };
        this._disabledDefaultCommands = disabledDefaultCommands.map(cmd => cmd.toLowerCase());
        this._botOwners = botOwners;
        this._cooldowns = new Cooldowns_1.default({
            instance: this,
            errorMessage: cooldownConfig?.defaultErrorMessage,
            botOwnersBypass: cooldownConfig?.botOwnersBypass,
            dbRequired: cooldownConfig?.dbRequired
        });
        if (configuration.defaultPrefix)
            this._defaultPrefix = configuration.defaultPrefix;
        if (debugging && debugging.showBanner !== undefined)
            this._showBanner = debugging.showBanner;
        try {
            if (this._showBanner)
                (0, show_intro_banner_1.default)(this._version);
            if (!language || (language !== "JavaScript" && language !== "TypeScript"))
                throw new NoCliHandlerError_1.default("Invalid language specified");
            if (!client)
                throw new NoCliHandlerError_1.default("No client provided");
            client
                .setMaxListeners(Infinity)
                .on("ready", async (client) => {
                (0, log_1.log)("NoCliHandler", "info", `Your bot ${client.user.tag} is up and running`);
                if (!botOwners.length) {
                    // Fetch
                    await client.application.fetch();
                    await client.guilds.fetch();
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
                this._mongoDBConnection = await this.connectToMongoDB(mongoDB);
                this.mongoDBConnection.connected
                    ? (0, log_1.log)('MongoDBInstance', "info", 'Connected to Database')
                    : (0, log_1.log)('MongoDBInstance', "warn", this.mongoDBConnection.errMessage);
                if (configuration.commandsDir) {
                    this._commandHandler = new CommandHandler_1.default(this, configuration.commandsDir, language);
                    this._commands = this._commandHandler.commands;
                }
                else
                    (0, log_1.log)("CommandHandlerWarning", "warn", "No commands directory provided, you will have to handle the commands yourself");
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
    get disabledDefaultCommands() { return this._disabledDefaultCommands; }
    get defaultPrefix() { return this._defaultPrefix; }
    get debug() { return this._debugging; }
    get commandHandler() { return this._commandHandler; }
    get commands() { return this._commands; }
    get emojiConfig() { return this._emojiConfig; }
    get cooldowns() { return this._cooldowns; }
    get mongoDBConnection() { return this._mongoDBConnection; }
    async connectToMongoDB(mongoDB) {
        return new Promise((resolve) => mongoDB
            ? mongoose_1.default.connect(mongoDB.uri, mongoDB.options ? mongoDB.options : { keepAlive: true, directConnection: true }, (err) => err
                ? resolve({ connected: false, errMessage: err.message })
                : resolve({ connected: true }))
            : resolve({ connected: false, errMessage: "MongoDB URI not found" }));
    }
}
exports.default = NoCliHandler;
