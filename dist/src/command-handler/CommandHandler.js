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
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (_) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
var log_1 = require("../functions/log");
var get_all_files_1 = __importDefault(require("../util/get-all-files"));
var Command_1 = __importDefault(require("./Command"));
// Validation imports
var argument_count_1 = __importDefault(require("./validations/run-time/argument-count"));
var callback_required_1 = __importDefault(require("./validations/syntax/callback-required"));
var description_required_1 = __importDefault(require("./validations/syntax/description-required"));
var CommandHandler = /** @class */ (function () {
    function CommandHandler(commandsDir, language) {
        this.commands = new Map();
        this._runTimeValidations = [argument_count_1.default];
        this._syntaxValidations = [callback_required_1.default, description_required_1.default];
        this.commandsDir = commandsDir;
        this._suffix = language === "TypeScript" ? "ts" : "js";
        this.readFiles();
    }
    CommandHandler.prototype.readFiles = function () {
        var validations = this._syntaxValidations;
        var files = (0, get_all_files_1.default)(this.commandsDir);
        for (var _i = 0, files_1 = files; _i < files_1.length; _i++) {
            var file = files_1[_i];
            var commandProperty = file.split(/[/\\]/).pop().split(".");
            var commandName = commandProperty[0];
            var commandSuffix = commandProperty[1];
            if (commandSuffix !== this._suffix)
                continue;
            var commandObject = this._suffix === "js"
                ? require(file)
                : Promise.resolve().then(function () { return __importStar(require(file)); });
            var command = new Command_1.default(commandName, commandObject);
            for (var _a = 0, validations_1 = validations; _a < validations_1.length; _a++) {
                var validation = validations_1[_a];
                validation(command);
            }
            this.commands.set(command.commandName, command);
        }
        var noCommands = this.commands.size === 0;
        var isOneOnly = this.commands.size === 1;
        (0, log_1.log)("NoCliHandler", "info", noCommands ? "No commands found" : "Loaded ".concat(this.commands.size, " command").concat(isOneOnly ? "" : "s"));
    };
    CommandHandler.prototype.importFile = function (filePath) {
        return __awaiter(this, void 0, void 0, function () {
            var file;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, (Promise.resolve().then(function () { return __importStar(require(filePath)); }))];
                    case 1:
                        file = _a.sent();
                        return [2 /*return*/, file === null || file === void 0 ? void 0 : file.default];
                }
            });
        });
    };
    CommandHandler.prototype.messageListener = function (client) {
        return __awaiter(this, void 0, void 0, function () {
            var prefix, validations;
            var _this = this;
            return __generator(this, function (_a) {
                prefix = '!';
                validations = this._runTimeValidations;
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
                    for (var _i = 0, validations_2 = validations; _i < validations_2.length; _i++) {
                        var validation = validations_2[_i];
                        if (!validation(command, usage, prefix))
                            return;
                    }
                    var callback = command.commandObject.callback;
                    callback(usage);
                });
                return [2 /*return*/];
            });
        });
    };
    return CommandHandler;
}());
exports.default = CommandHandler;
