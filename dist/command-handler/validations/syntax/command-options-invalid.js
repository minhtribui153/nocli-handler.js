"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const NoCliCommandError_1 = __importDefault(require("../../../errors/NoCliCommandError"));
const types_1 = require("../../../types");
exports.default = (command) => {
    const { commandObject: { options = [], type } } = command;
    if (typeof type === "string" && !types_1.NoCliCommandTypeArray.includes(type)) {
        throw new NoCliCommandError_1.default(`Command ${command.commandName} has an invalid type. Type must either be NoCliCommandType, NoCliCommandTypeString or number.`);
    }
    for (const option of options) {
        if (typeof option.type !== "number") {
            throw new NoCliCommandError_1.default(`Command "${command.commandName}" has an invalid option type for "${option.name}"`);
        }
    }
};
