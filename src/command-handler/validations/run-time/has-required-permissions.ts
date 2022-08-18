import { Message, PermissionFlagsBits } from "discord.js";

const keys = Object.keys(PermissionFlagsBits);

import { CommandCallbackOptions } from "../../../types";
import Command from "../../Command";

export default (command: Command, usage: CommandCallbackOptions, prefix: string) => {
    const { permissions = [] } = command.commandObject;
    const { member, message, interaction } = usage;

    if (member && permissions.length) {
        const missingPermissions = [];

        for (let permission of permissions) {
            // @ts-ignore
            if (typeof permission === "string") permission = PermissionFlagsBits[permission]
            if (!member.permissions.has(permission)) {
                // @ts-ignore
                const permissionName = keys.find((key) => PermissionFlagsBits[key] === permission);
                if (permissionName) missingPermissions.push(permissionName)
            }
        }

        if (missingPermissions.length) {
            const text = `You need these permissions to run this command: "${missingPermissions.join('", "')}"`;
            
            if (message) message.reply(text);
            else if (interaction) interaction.reply({ content: text, ephemeral: true });
            return false;
        }
    }

    return true;
}