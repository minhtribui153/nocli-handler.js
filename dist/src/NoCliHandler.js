"use strict";
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
var CommandHandler_1 = __importDefault(require("./command-handler/CommandHandler"));
var NoCliHandlerError_1 = __importDefault(require("./errors/NoCliHandlerError"));
var mongoose_1 = __importDefault(require("mongoose"));
var node_banner_1 = __importDefault(require("node-banner"));
var log_1 = require("./functions/log");
var package_json_1 = require("../package.json");
var NoCliHandler = /** @class */ (function () {
    function NoCliHandler(options) {
        this.options = options;
        this.main();
    }
    NoCliHandler.prototype.main = function () {
        return __awaiter(this, void 0, void 0, function () {
            var commandHandlerInstance, error;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        console.clear();
                        return [4 /*yield*/, (0, node_banner_1.default)("NoCliHandler.JS", "Version ".concat(package_json_1.version), "green", "red")];
                    case 1:
                        _a.sent();
                        try {
                            if (!this.options.language || (this.options.language !== "JavaScript" && this.options.language !== "TypeScript"))
                                throw new NoCliHandlerError_1.default("Invalid language specified");
                            if (!this.options.client)
                                throw new NoCliHandlerError_1.default("No client provided");
                            this.options.client
                                .setMaxListeners(Infinity)
                                .on("ready", function (bot) { return (0, log_1.log)("NoCliHandler", "info", "Your bot ".concat(bot.user.tag, " is up and running")); });
                            if (this.options.commandsDir) {
                                commandHandlerInstance = new CommandHandler_1.default(this.options.commandsDir, this.options.language);
                                commandHandlerInstance.messageListener(this.options.client);
                            }
                            this.options.mongoDB !== undefined
                                ? this.connectToMongoDB(this.options.mongoDB)
                                : (0, log_1.log)("NoCliHandler", "warn", "No mongoURI provided");
                        }
                        catch (err) {
                            error = err;
                            (0, log_1.log)(error.name, "error", error.message);
                            return [2 /*return*/, process.exit(1)];
                        }
                        return [2 /*return*/];
                }
            });
        });
    };
    NoCliHandler.prototype.connectToMongoDB = function (mongoDB) {
        var options = mongoDB.options;
        mongoose_1.default.connect(mongoDB.uri, options ? options : { keepAlive: true }, function (err) { return err
            ? (0, log_1.log)("NoCliHandler", "warn", "Error connecting to MongoDB: " + err)
            : (0, log_1.log)("NoCliHandler", "info", "Connected to MongoDB"); });
    };
    return NoCliHandler;
}());
exports.default = NoCliHandler;
