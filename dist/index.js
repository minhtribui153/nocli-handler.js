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
__exportStar(require("./functions/log"), exports);
__exportStar(require("./types"), exports);
const CommandHandler_1 = __importDefault(require("./command-handler/CommandHandler"));
const NoCliHandlerError_1 = __importDefault(require("./errors/NoCliHandlerError"));
const mongoose_1 = __importDefault(require("mongoose"));
const node_banner_1 = __importDefault(require("node-banner"));
const log_1 = require("./functions/log");
const handleError_1 = __importDefault(require("./functions/handleError"));
class NoCliHandler {
    _options;
    _version = '1.0.3';
    _testServers = [];
    _configuration;
    _language;
    _debugging;
    _showBanner = true;
    _defaultPrefix = "!";
    constructor(options) {
        this._options = options;
        this._configuration = options.configuration;
        this._debugging = options.debugging;
        this._language = options.language;
        if (this._options.testServers)
            this._testServers = this._options.testServers;
        if (this._configuration.defaultPrefix)
            this._defaultPrefix = this._configuration.defaultPrefix;
        if (this._debugging && this._debugging.showBanner !== undefined)
            this._showBanner = this._debugging.showBanner;
        this.main();
    }
    get client() { return this._options.client; }
    get testServers() { return this._testServers; }
    get defaultPrefix() { return this._defaultPrefix; }
    get debug() { return this._debugging; }
    async main() {
        try {
            if (this._showBanner) {
                console.clear();
                await (0, node_banner_1.default)("NoCliHandler.JS", this._version, "green", "red");
            }
            if (!this._language || (this._language !== "JavaScript" && this._language !== "TypeScript"))
                throw new NoCliHandlerError_1.default("Invalid language specified");
            if (!this._options.client)
                throw new NoCliHandlerError_1.default("No client provided");
            this._options.client
                .setMaxListeners(Infinity)
                .on("ready", bot => (0, log_1.log)("NoCliHandler", "info", `Your bot ${bot.user.tag} is up and running`));
            if (this._configuration.commandsDir) {
                const commandHandlerInstance = new CommandHandler_1.default(this, this._configuration.commandsDir, this._language);
                commandHandlerInstance.messageListener(this._options.client);
            }
            else
                (0, log_1.log)("NoCliHandler", "warn", "No commands directory provided, you will have to handle the commands yourself");
            this._options.mongoDB !== undefined
                ? this.connectToMongoDB(this._options.mongoDB)
                : (0, log_1.log)("NoCliHandler", "warn", "No mongoURI provided");
        }
        catch (err) {
            const error = err;
            const showFullErrorLog = this._debugging !== undefined
                ? this._debugging.showFullErrorLog
                : false;
            (0, handleError_1.default)(error, showFullErrorLog);
        }
    }
    connectToMongoDB(mongoDB) {
        const options = mongoDB.options;
        mongoose_1.default.connect(mongoDB.uri, options ? options : { keepAlive: true }, (err) => err
            ? (0, log_1.log)("NoCliHandler", "warn", "Error connecting to MongoDB: " + err)
            : (0, log_1.log)("NoCliHandler", "info", "Connected to MongoDB"));
    }
}
exports.default = NoCliHandler;
