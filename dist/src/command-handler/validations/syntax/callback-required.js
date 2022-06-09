"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
var NoCliCommandError_1 = __importDefault(require("../../../errors/NoCliCommandError"));
exports.default = (function (command) {
    var commandObject = command.commandObject, commandName = command.commandName;
    if (!commandObject.callback)
        throw new NoCliCommandError_1.default("Command \"".concat(commandName, "\" does not have a callback function"));
});
