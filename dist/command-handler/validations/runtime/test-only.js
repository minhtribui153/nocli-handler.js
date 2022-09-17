"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = (command, usage, prefix) => {
    const { instance, commandObject } = command;
    const { guild } = usage;
    if (commandObject.testOnly !== true)
        return true;
    if (!guild)
        return true;
    return instance.testServers.includes(guild.id);
};
