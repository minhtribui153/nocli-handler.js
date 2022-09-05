import { ICommand, NoCliCommandType } from "../../types";

export default {
    description: "Creates a custom command for this server",
    type: NoCliCommandType.Slash,

    minArgs: 3,
    expectedArgs: "<command_name> <description> <response>",
    permissions: ["Administrator"],

    guildOnly: true,

    callback: async ({ instance, args, guild }) => {
        const [commandName, description, response] = args;

        let created = false;

        if (instance.commandHandler!.commands.has(commandName)) return {
            content: `${instance.emojiConfig.error} Custom command "${commandName}" cannot be created since there is already a same existing non-custom command!`,
            ephemeral: true,
        }

        if (instance.commandHandler!.customCommands.commands.has(`${guild!.id}-${commandName}`)) created = true;

        await instance.commandHandler!.customCommands.create(guild!.id, commandName, description, response);

        return `${instance.emojiConfig.success} Custom command "${commandName}" has been ${created ? "updated" : "created"}!`
    }
} as ICommand;