import { CommandInteraction, Message } from "discord.js";

import customCommandsSchema from "../models/custom-commands-schema";
import CommandHandler from "./CommandHandler";

class CustomCommands {
    private _customCommands = new Map<string, string>();
    private _commandHandler: CommandHandler;
    
    constructor(commandHandler: CommandHandler) {
        this._commandHandler = commandHandler;
        this.loadCommands()
    }
    
    // guildId-commandName: response
    get commands(): Map<string, string> { return this._customCommands }

    async loadCommands() {
        const results = await customCommandsSchema.find({});

        for (const result of results) {
            const { _id, response } = result;
            this._customCommands.set(_id, response)
        }
    }

    async create(guildId: string, commandName: string, description: string, response: string) {
        const _id = `${guildId}-${commandName}`;

        this._customCommands.set(_id, response);

        this._commandHandler.slashCommands.create(commandName, description, [], guildId);

        await customCommandsSchema.findOneAndUpdate({ _id }, { _id, response }, { upsert: true })
    }

    async delete(guildId: string, commandName: string) {
        const _id = `${guildId}-${commandName}`;

        this._customCommands.delete(_id);

        this._commandHandler.slashCommands.delete(commandName, guildId);

        await customCommandsSchema.deleteOne({ _id });
    }

    async run(commandName: string, message?: Message, interaction?: CommandInteraction) {
        const guild = message ? message.guild : interaction!.guild;

        if (!guild) return;

        const _id = `${guild.id}-${commandName}`;
        const response = this._customCommands.get(_id);
        
        if (!response) return;

        if (message) message.channel.send(response).catch(() => {});
        else if (interaction) interaction.reply(response).catch(() => {});
    }
}

export default CustomCommands;