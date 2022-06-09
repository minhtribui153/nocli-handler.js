"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
var NoCliCommandError_1 = __importDefault(require("../../../errors/NoCliCommandError"));
exports.default = (function (command, usage, prefix) {
    var _a, _b;
    var _c = command.commandObject, _d = _c.minArgs, minArgs = _d === void 0 ? 0 : _d, _e = _c.maxArgs, maxArgs = _e === void 0 ? -1 : _e;
    var length = usage.args.length;
    if ((length < minArgs) || (length > maxArgs && maxArgs !== -1)) {
        var text = (_a = command.commandObject.correctSyntax) !== null && _a !== void 0 ? _a : "Invalid Syntax! Correct Syntax: `".concat(prefix).concat(command.commandName, " ").concat(command.commandObject.usage, "`");
        var specifyUsage = (_b = command.commandObject.usage) !== null && _b !== void 0 ? _b : "";
        if (specifyUsage === "")
            throw new NoCliCommandError_1.default("Command does not have a valid usage! <> = required, [] = optional");
        usage.message.reply(text.replace("[PREFIX]", prefix).replace("[USAGE]", specifyUsage));
        return false;
    }
    return true;
});
