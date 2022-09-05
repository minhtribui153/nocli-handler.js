import { CommandCallbackOptions } from "../../../types";
import Command from "../../Command";
import requiredRolesSchema from "../../../models/required-roles-schema";

export default async (command: Command, usage: CommandCallbackOptions, prefix: string) => {
    const { guild, member, message, interaction } = usage;

    if (!member) return true;

    const _id = `${guild?.id}-${command.commandName}`;
    const document = await requiredRolesSchema.findById(_id);

    
    if (document) {
        let hasRole = false;

        for (const roleId of document.roles) {
            if (member.roles.cache.has(roleId)) {
                hasRole = true;
                break
            }

        }

        if (hasRole) return true;
    
        const reply = {
            content: `${command.instance.emojiConfig.error} You need one of these roles to run this command: ${document.roles.map(roleId => `<@&${roleId}>`)}`,
            allowedMentions: {
                roles: []
            }
        }

        if (message) message.reply(reply);
        else if (interaction) interaction.reply(reply);

        return false;
    }


    return true;
}