"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = {
    description: "Sets the default prefix for this server",
    maxArgs: 1,
    expectedArgs: "[prefix]",
    type: 'Both',
    guildOnly: true,
    permissions: ["Administrator"],
    callback: async ({ instance, guild, text: prefix }) => {
        if (!prefix.length) {
            const prefix = instance.commandHandler.prefixHandler.get(guild?.id);
            return `${instance.emojiConfig.info} The current command prefix for this server is "${prefix}"`;
        }
        instance.commandHandler.prefixHandler.set(guild.id, prefix);
        return `${instance.emojiConfig.success} "${prefix}" is now the command prefix for this server`;
    }
};
