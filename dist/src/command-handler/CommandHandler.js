"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
// Default import
var get_all_files_1 = __importDefault(require("../util/get-all-files"));
var Command_1 = __importDefault(require("./Command"));
// Validation imports
var argument_count_1 = __importDefault(require("./validations/argument-count"));
var log_1 = require("../functions/log");
var CommandHandler = /** @class */ (function () {
    function CommandHandler(commandsDir) {
        this.commands = new Map();
        this.validations = [argument_count_1.default];
        this.commandsDir = commandsDir;
        this.readFiles();
    }
    CommandHandler.prototype.readFiles = function () {
        var files = (0, get_all_files_1.default)(this.commandsDir);
        for (var _i = 0, files_1 = files; _i < files_1.length; _i++) {
            var file = files_1[_i];
            var commandObject = require(file);
            var commandName = file.split(/[/\\]/).pop().split(".")[0];
            var command = new Command_1.default(commandName, commandObject);
            this.commands.set(command.commandName, command);
        }
        var noCommands = this.commands.size === 0;
        var isOneOnly = this.commands.size === 1;
        (0, log_1.log)("NoCliHandler", "info", noCommands ? "No commands found" : "Loaded ".concat(this.commands.size, " command").concat(isOneOnly ? "" : "s"));
    };
    CommandHandler.prototype.messageListener = function (client) {
        var _this = this;
        var prefix = '!';
        client.on("messageCreate", function (message) {
            var _a;
            var author = message.author, content = message.content;
            if (author.bot)
                return;
            if (!content.startsWith(prefix))
                return;
            var args = content.split(/\s+/);
            var commandName = (_a = args.shift()) === null || _a === void 0 ? void 0 : _a.substring(1).toLowerCase();
            if (!commandName)
                return;
            var command = _this.commands.get(commandName);
            if (!command)
                return;
            var usage = { client: client, message: message, args: args, text: args.join(" ") };
            for (var _i = 0, _b = _this.validations; _i < _b.length; _i++) {
                var validation = _b[_i];
                if (!validation(command, usage, prefix))
                    return;
            }
            var callback = command.commandObject.callback;
            callback(usage);
        });
    };
    return CommandHandler;
}());
exports.default = CommandHandler;
