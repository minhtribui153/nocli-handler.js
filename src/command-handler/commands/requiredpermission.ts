import { ApplicationCommandOptionType, PermissionFlagsBits } from "discord.js";
import { ICommand, NoCliCommandType } from "../../types";
import requiredPermissionsSchema from "../../models/required-permissions-schema";
import handleCommandAutocomplete from "../../functions/handle-command-autocomplete";

const clearAllPermissions = "Clear All Permissions";

export default {
    description: "Sets the permissions required for a command",

    type: NoCliCommandType.Slash,
    guildOnly: true,
    permissions: ["Administrator"],

    options: [
        {
            name: "command",
            description: "The command to set permissions to",
            type: ApplicationCommandOptionType.String,
            required: true,
            autocomplete: true,
        },
        {
            name: "permission",
            description: "The permission to set for the command",
            type: ApplicationCommandOptionType.String,
            required: false,
            autocomplete: true,
        }
    ],

    autocomplete: (interaction, command, arg) => {
        if (arg === 'command') handleCommandAutocomplete(command.instance.commands!, interaction.guildId);
        else if (arg === 'permission') return [clearAllPermissions, ...Object.keys(PermissionFlagsBits)]
    },
    
    callback: async ({ instance, guild, args }) => {
        const [commandName, permission] = args;

        const command = instance.commandHandler?.commands.get(commandName);
        if (!command) {
            return {
                content: `${instance.emojiConfig.error} Command "${commandName}" does not exist`,
                ephemeral: true,
            }
        }

        const _id = `${guild!.id}-${command.commandName}`;

        if (!permission) {
            const document = await requiredPermissionsSchema.findById(_id);

            const permissions = document && document.permissions?.length ? document.permissions.join(', ') : "not specified yet";
            const isOneOnly = document ? document.permissions.length === 1 : false;
            return `${instance.emojiConfig.info}  The required permission${isOneOnly ? "" : "s"} for "${commandName}" ${isOneOnly ? "is" : "are"} ${permissions}`
        }
        
        if (permission === clearAllPermissions) {
            await requiredPermissionsSchema.deleteOne({ _id });

            return `${instance.emojiConfig.disabled} Command "${commandName}" no longer requires any permissions`
        }

        const alreadyExists = await requiredPermissionsSchema.findOne({
            _id,
            permissions: {
                $in: [permission]
            }
        });

        if (alreadyExists) {
            await requiredPermissionsSchema.findOneAndUpdate(
                { _id },
                {
                    _id,
                    $pull: {
                        permissions: permission,
                    }
                }
            )

            return `${instance.emojiConfig.disabled} Command "${commandName}" no longer requires the permission "${permission}"`
        }

        await requiredPermissionsSchema.findOneAndUpdate(
            { _id },
            {
                _id,
                $addToSet: {
                    permissions: permission
                }
            }, {
                upsert: true
            }
        )

        return `${instance.emojiConfig.enabled} Command "${commandName}" now requires the permission "${permission}"`
    }
} as ICommand