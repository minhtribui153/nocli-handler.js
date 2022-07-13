"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const NoCliCommandError_1 = __importDefault(require("../../../errors/NoCliCommandError"));
exports.default = (command) => {
    const { instance, commandName, commandObject } = command;
    if (commandObject.ownerOnly !== true || instance.botOwners.length)
        return;
    throw new NoCliCommandError_1.default(`Command "${commandName}" is a owner only command, but no owners are specified`);
};
