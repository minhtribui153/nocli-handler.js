"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const NoCliCommandError_1 = __importDefault(require("../../../errors/NoCliCommandError"));
exports.default = (command) => {
    const { commandObject: { options = [] } } = command;
    for (const option of options) {
        if (typeof option.type !== "number") {
            throw new NoCliCommandError_1.default(`Command "${command.commandName}" has an invalid option type for "${option.name}"`);
        }
    }
};
