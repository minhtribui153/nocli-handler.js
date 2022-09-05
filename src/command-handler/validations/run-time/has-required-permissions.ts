import { Message, PermissionFlagsBits } from "discord.js";
import requiredPermissionsSchema from "../../../models/required-permissions-schema";

const keys = Object.keys(PermissionFlagsBits);

import { CommandCallbackOptions } from "../../../types";
import Command from "../../Command";

export default async (command: Command, usage: CommandCallbackOptions, prefix: string) => {
    const { permissions = [] } = command.commandObject;
    const { guild, member, message, interaction } = usage;

    if (!member) return true;

    const document = await requiredPermissionsSchema.findById(`${guild?.id}-${command.commandName}`);
    if (document) {
        for (const permission of document.permissions) {
            // @ts-ignore
            if (!permissions.includes(permission)) permissions.push(permission)
        }
    }

    

    if (member && permissions.length) {
        const missingPermissions = [];

        for (let permission of permissions) {
            if (!member.permissions.has(permission)) {
                // @ts-ignore
                const permissionName = keys.find((key) => key === permission || PermissionFlagsBits[key] === permission);
                if (permissionName) missingPermissions.push(permissionName)
            }
        }

        if (missingPermissions.length) {
            const text = `${command.instance.emojiConfig.error} You need these permissions to run this command: "${missingPermissions.join('", "')}"`;
            if (message) message.reply(text);
            else if (interaction) interaction.reply({ content: text, ephemeral: true });
            return false;
        }
    }

    return true;
}