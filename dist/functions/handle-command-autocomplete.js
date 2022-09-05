"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = (commands, guildId, defaultCommands = false) => {
    const originalCommands = [];
    commands.forEach((command) => {
        if (command.isAnAlias)
            return;
        else if (command.commandObject.testOnly && guildId) {
            // Check if guild is a test guild
            if (!command.instance.testServers.includes(guildId))
                return;
        }
        else if (defaultCommands) {
            if (!command.isDefaultCommand)
                return;
        }
        else {
            if (command.isDefaultCommand)
                return;
        }
        return originalCommands.push(command.commandName);
    });
    return [...originalCommands];
};
