"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const discord_js_1 = require("discord.js");
const required_permissions_schema_1 = __importDefault(require("../../../models/required-permissions-schema"));
const keys = Object.keys(discord_js_1.PermissionFlagsBits);
exports.default = async (command, usage, prefix) => {
    const { permissions = [] } = command.commandObject;
    const { guild, member, message, interaction } = usage;
    if (!member)
        return true;
    const document = await required_permissions_schema_1.default.findById(`${guild?.id}-${command.commandName}`);
    if (document) {
        for (const permission of document.permissions) {
            // @ts-ignore
            if (!permissions.includes(permission))
                permissions.push(permission);
        }
    }
    if (member && permissions.length) {
        const missingPermissions = [];
        for (let permission of permissions) {
            if (!member.permissions.has(permission)) {
                // @ts-ignore
                const permissionName = keys.find((key) => key === permission || discord_js_1.PermissionFlagsBits[key] === permission);
                if (permissionName)
                    missingPermissions.push(permissionName);
            }
        }
        if (missingPermissions.length) {
            const text = `${command.instance.emojiConfig.error} You need these permissions to run this command: "${missingPermissions.join('", "')}"`;
            if (message)
                message.reply(text);
            else if (interaction)
                interaction.reply({ content: text, ephemeral: true });
            return false;
        }
    }
    return true;
};
