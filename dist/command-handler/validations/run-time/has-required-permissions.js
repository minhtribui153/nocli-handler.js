"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const discord_js_1 = require("discord.js");
const keys = Object.keys(discord_js_1.PermissionFlagsBits);
exports.default = (command, usage, prefix) => {
    const { permissions = [] } = command.commandObject;
    const { member, message, interaction } = usage;
    if (member && permissions.length) {
        const missingPermissions = [];
        for (let permission of permissions) {
            // @ts-ignore
            if (typeof permission === "string")
                permission = discord_js_1.PermissionFlagsBits[permission];
            if (!member.permissions.has(permission)) {
                // @ts-ignore
                const permissionName = keys.find((key) => discord_js_1.PermissionFlagsBits[key] === permission);
                if (permissionName)
                    missingPermissions.push(permissionName);
            }
        }
        if (missingPermissions.length) {
            const text = `You need these permissions to run this command: "${missingPermissions.join('", "')}"`;
            if (message)
                message.reply(text);
            else if (interaction)
                interaction.reply({ content: text, ephemeral: true });
            return false;
        }
    }
    return true;
};
