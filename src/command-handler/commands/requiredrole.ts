import { ApplicationCommandOptionType } from "discord.js";
import { ICommand, NoCliCommandType } from "../../types";
import requiredrolesSchema from "../../models/required-roles-schema";
import handleCommandAutocomplete from "../../functions/handle-command-autocomplete";

export default {
    description: "Sets the roles required for a command",
    
    type: NoCliCommandType.Slash,
    guildOnly: true,
    roles: ["Administrator"],
    
    options: [
        {
            name: "command",
            description: "The command to set roles to",
            type: ApplicationCommandOptionType.String,
            required: true,
            autocomplete: true,
        },
        {
            name: "role",
            description: "The role to set for the command",
            type: ApplicationCommandOptionType.Role,
            required: false,
        }
    ],
    
    autocomplete: (interaction, command) => handleCommandAutocomplete(command.instance.commands!, interaction.guildId),
    
    callback: async ({ instance, guild, args }) => {
        const [commandName, role] = args;

        const command = instance.commandHandler?.commands.get(commandName);
        if (!command) {
            return {
                content: `${instance.emojiConfig.error} Command "${commandName}" does not exist`,
                ephemeral: true,
            }
        }

        const _id = `${guild?.id}-${command.commandName}`;

        if (!role) {
            const document = await requiredrolesSchema.findById(_id);

            const roles = document && document.roles?.length ? document.roles.map((roleId) => `<@&${roleId}>`) : "not specified yet";
            const isOneOnly = document ? document.roles?.length === 1 : false;
            return {
                content: `${instance.emojiConfig.info} The required role${isOneOnly ? "" : "s"} for "${commandName}" ${isOneOnly ? "is" : "are"} ${roles}`,
                allowedMentions: {
                    roles: []
                }
            }
        }

        const alreadyExists = await requiredrolesSchema.findOne({
            _id,
            roles: {
                $in: [role]
            }
        });

        if (alreadyExists) {
            await requiredrolesSchema.findOneAndUpdate(
                { _id },
                {
                    _id,
                    $pull: {
                        roles: role,
                    }
                }
            )

            return {
                content: `${instance.emojiConfig.disabled} Command "${commandName}" no longer requires the role <@&${role}>`,
                allowedMentions: {
                    roles: []
                }
            }
        }

        await requiredrolesSchema.findOneAndUpdate(
            { _id },
            {
                _id,
                $addToSet: {
                    roles: role
                }
            }, {
                upsert: true
            }
        )

        return {
            content: `${instance.emojiConfig.enabled} Command "${commandName}" now requires the role <@&${role}>`,
            allowedMentions: {
                roles: []
            }
        }
    }
} as ICommand