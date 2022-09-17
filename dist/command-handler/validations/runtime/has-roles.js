"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const required_roles_schema_1 = __importDefault(require("../../../models/required-roles-schema"));
exports.default = async (command, usage, prefix) => {
    const { guild, member, message, interaction } = usage;
    if (!member)
        return true;
    const _id = `${guild?.id}-${command.commandName}`;
    const document = await required_roles_schema_1.default.findById(_id);
    if (document) {
        let hasRole = false;
        for (const roleId of document.roles) {
            if (member.roles.cache.has(roleId)) {
                hasRole = true;
                break;
            }
        }
        if (hasRole)
            return true;
        const reply = {
            content: `${command.instance.emojiConfig.error} You need one of these roles to run this command: ${document.roles.map(roleId => `<@&${roleId}>`)}`,
            allowedMentions: {
                roles: []
            }
        };
        if (message)
            message.reply(reply);
        else if (interaction)
            interaction.reply(reply);
        return false;
    }
    return true;
};
