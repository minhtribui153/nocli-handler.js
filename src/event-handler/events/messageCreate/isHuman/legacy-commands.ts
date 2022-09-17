import { Events } from "discord.js";
import { IEvent } from "../../../../types";

export default {
    description: "The Legacy Commands handler",
    callback: async (instance, message) => {
        const { author, content, guild } = message;

        const { commandHandler } = instance
        const { prefixHandler, commands, customCommands } = commandHandler!
        
        if (author.bot) return;
        const prefix = prefixHandler.get(guild?.id)
        if (!content.startsWith(prefix)) return;

        const args = content.split(/\s+/);
        const commandName = args.shift()
            ?.substring(prefix.length)
            .toLowerCase();
        
        if (!commandName) return;

        const command = commands.get(commandName);
        if (!command) {
            customCommands.run(commandName, message);
            return
        };
        
        const res = await commandHandler!.runCommand(command, args, message, null);
        if (!res) return;

        const { response, reply } = res;
        
        if (reply) message.reply(response).catch(() => {});
        else message.channel.send(response).catch(() => {});
    }
} as IEvent<Events.MessageCreate>