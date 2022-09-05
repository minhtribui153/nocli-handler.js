"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const discord_js_1 = require("discord.js");
const types_1 = require("../../types");
const required_roles_schema_1 = __importDefault(require("../../models/required-roles-schema"));
const handle_command_autocomplete_1 = __importDefault(require("../../functions/handle-command-autocomplete"));
exports.default = {
    description: "Sets the roles required for a command",
    type: types_1.NoCliCommandType.Slash,
    guildOnly: true,
    roles: ["Administrator"],
    options: [
        {
            name: "command",
            description: "The command to set roles to",
            type: discord_js_1.ApplicationCommandOptionType.String,
            required: true,
            autocomplete: true,
        },
        {
            name: "role",
            description: "The role to set for the command",
            type: discord_js_1.ApplicationCommandOptionType.Role,
            required: false,
        }
    ],
    autocomplete: (interaction, command) => (0, handle_command_autocomplete_1.default)(command.instance.commands, interaction.guildId),
    callback: async ({ instance, guild, args }) => {
        const [commandName, role] = args;
        const command = instance.commandHandler?.commands.get(commandName);
        if (!command) {
            return {
                content: `${instance.emojiConfig.error} Command "${commandName}" does not exist`,
                ephemeral: true,
            };
        }
        const _id = `${guild?.id}-${command.commandName}`;
        if (!role) {
            const document = await required_roles_schema_1.default.findById(_id);
            const roles = document && document.roles?.length ? document.roles.map((roleId) => `<@&${roleId}>`) : "not specified yet";
            const isOneOnly = document ? document.roles?.length === 1 : false;
            return {
                content: `${instance.emojiConfig.info} The required role${isOneOnly ? "" : "s"} for "${commandName}" ${isOneOnly ? "is" : "are"} ${roles}`,
                allowedMentions: {
                    roles: []
                }
            };
        }
        const alreadyExists = await required_roles_schema_1.default.findOne({
            _id,
            roles: {
                $in: [role]
            }
        });
        if (alreadyExists) {
            await required_roles_schema_1.default.findOneAndUpdate({ _id }, {
                _id,
                $pull: {
                    roles: role,
                }
            });
            return {
                content: `${instance.emojiConfig.disabled} Command "${commandName}" no longer requires the role <@&${role}>`,
                allowedMentions: {
                    roles: []
                }
            };
        }
        await required_roles_schema_1.default.findOneAndUpdate({ _id }, {
            _id,
            $addToSet: {
                roles: role
            }
        }, {
            upsert: true
        });
        return {
            content: `${instance.emojiConfig.enabled} Command "${commandName}" now requires the role <@&${role}>`,
            allowedMentions: {
                roles: []
            }
        };
    }
};
