import { CommandInteraction, Message } from "discord.js";

import customCommandsSchema from "../models/custom-commands-schema";
import CommandHandler from "./CommandHandler";

/** The nocli-handler.js feature class that handles custom commands */
class CustomCommands {
    private _customCommands = new Map<string, string>();
    private _commandHandler: CommandHandler;
    
    constructor(commandHandler: CommandHandler) {
        this._commandHandler = commandHandler;
        this.loadCommands()
    }
    
    // guildId-commandName: response
    get commands(): Map<string, string> { return this._customCommands }

    /** Loads the custom commands */
    async loadCommands() {
        const results = await customCommandsSchema.find({});

        for (const result of results) {
            const { _id, response } = result;
            this._customCommands.set(_id, response)
        }
    }

    /**
     * Creates a custom command for a guild
     * @param {string} guildId The Guild ID
     * @param {string} commandName The command name
     * @param {string} description The command description
     * @param {string} response The command response
     * @returns {Promise<void>}
     */
    async create(guildId: string, commandName: string, description: string, response: string) {
        const _id = `${guildId}-${commandName}`;

        this._customCommands.set(_id, response);

        this._commandHandler.slashCommands.create(commandName, description, [], guildId);

        await customCommandsSchema.findOneAndUpdate({ _id }, { _id, response }, { upsert: true })
    }

    /**
     * Deletes a custom command from a guild
     * @param {string} guildId The Guild ID
     * @param {string} commandName The command name
     * @returns {Promise<void>}
     */
    async delete(guildId: string, commandName: string) {
        const _id = `${guildId}-${commandName}`;

        this._customCommands.delete(_id);

        this._commandHandler.slashCommands.delete(commandName, guildId);

        await customCommandsSchema.deleteOne({ _id });
    }

    /**
     * Runs a custom command in a guild
     * @param {string} commandName The command name
     * @param {Message} message The Message instance
     * @param {CommandInteraction} interaction The CommandInteraction instance
     * @returns {Promise<void>}
     */
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