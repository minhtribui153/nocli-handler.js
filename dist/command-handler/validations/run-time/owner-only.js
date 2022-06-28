"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = (command, usage) => {
    const { instance, commandObject } = command;
    const { user } = usage;
    const { botOwners } = instance;
    if (commandObject.ownerOnly && !botOwners.includes(user.id)) {
        return false;
    }
    return true;
};
