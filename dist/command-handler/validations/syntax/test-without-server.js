"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const NoCliCommandError_1 = __importDefault(require("../../../errors/NoCliCommandError"));
exports.default = (command) => {
    const { instance, commandName, commandObject } = command;
    if (commandObject.testOnly !== true || instance.testServers.length)
        return;
    throw new NoCliCommandError_1.default(`Command "${commandName}" is a test only command, but no test servers are specified`);
};
