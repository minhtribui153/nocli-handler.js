"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const discord_js_1 = require("discord.js");
const types_1 = require("../../types");
const required_permissions_schema_1 = __importDefault(require("../../models/required-permissions-schema"));
const handle_command_autocomplete_1 = __importDefault(require("../../functions/handle-command-autocomplete"));
const clearAllPermissions = "Clear All Permissions";
exports.default = {
    description: "Sets the permissions required for a command",
    type: types_1.NoCliCommandType.Slash,
    guildOnly: true,
    permissions: ["Administrator"],
    options: [
        {
            name: "command",
            description: "The command to set permissions to",
            type: discord_js_1.ApplicationCommandOptionType.String,
            required: true,
            autocomplete: true,
        },
        {
            name: "permission",
            description: "The permission to set for the command",
            type: discord_js_1.ApplicationCommandOptionType.String,
            required: false,
            autocomplete: true,
        }
    ],
    autocomplete: (interaction, command, arg) => {
        if (arg === 'command')
            (0, handle_command_autocomplete_1.default)(command.instance.commands, interaction.guildId);
        else if (arg === 'permission')
            return [clearAllPermissions, ...Object.keys(discord_js_1.PermissionFlagsBits)];
    },
    callback: async ({ instance, guild, args }) => {
        const [commandName, permission] = args;
        const command = instance.commandHandler?.commands.get(commandName);
        if (!command) {
            return {
                content: `${instance.emojiConfig.error} Command "${commandName}" does not exist`,
                ephemeral: true,
            };
        }
        const _id = `${guild.id}-${command.commandName}`;
        if (!permission) {
            const document = await required_permissions_schema_1.default.findById(_id);
            const permissions = document && document.permissions?.length ? document.permissions.join(', ') : "not specified yet";
            const isOneOnly = document ? document.permissions.length === 1 : false;
            return `${instance.emojiConfig.info}  The required permission${isOneOnly ? "" : "s"} for "${commandName}" ${isOneOnly ? "is" : "are"} ${permissions}`;
        }
        if (permission === clearAllPermissions) {
            await required_permissions_schema_1.default.deleteOne({ _id });
            return `${instance.emojiConfig.disabled} Command "${commandName}" no longer requires any permissions`;
        }
        const alreadyExists = await required_permissions_schema_1.default.findOne({
            _id,
            permissions: {
                $in: [permission]
            }
        });
        if (alreadyExists) {
            await required_permissions_schema_1.default.findOneAndUpdate({ _id }, {
                _id,
                $pull: {
                    permissions: permission,
                }
            });
            return `${instance.emojiConfig.disabled} Command "${commandName}" no longer requires the permission "${permission}"`;
        }
        await required_permissions_schema_1.default.findOneAndUpdate({ _id }, {
            _id,
            $addToSet: {
                permissions: permission
            }
        }, {
            upsert: true
        });
        return `${instance.emojiConfig.enabled} Command "${commandName}" now requires the permission "${permission}"`;
    }
};
