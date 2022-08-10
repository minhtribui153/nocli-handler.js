"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const NoCliCommandError_1 = __importDefault(require("../../../errors/NoCliCommandError"));
const types_1 = require("../../../types");
exports.default = (command) => {
    const { commandObject, commandName } = command;
    if (!commandObject.cooldowns)
        return;
    let counter = 0;
    for (const type of types_1.cooldownTypesArray) {
        // @ts-ignore
        if (commandObject.cooldowns[type])
            ++counter;
    }
    if (counter === 0)
        throw new NoCliCommandError_1.default(`Command "${commandName}" has a cooldown object, but no cooldown types were specified. Please use one of the following: ${types_1.cooldownTypesArray.join(', ')}`);
    if (counter > 1)
        throw new NoCliCommandError_1.default(`Command "${commandName}" has multiple cooldown types, you must specify only one`);
};
