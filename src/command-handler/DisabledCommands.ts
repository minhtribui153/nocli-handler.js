import disabledCommandsSchema from "../models/disabled-commands-schema"

/** The nocli-handler.js feature class to disable commands */
class DisabledCommands {
    // array of `${guildId}-${commandName}`
    private _disabledCommands: string[] = []

    constructor() {
        this.loadDisabledCommands()
    }

    /** Loads the disabled commands */
    async loadDisabledCommands() {
        const results = await disabledCommandsSchema.find({});

        for (const result of results) {
            this._disabledCommands.push(result._id);
        }
    }

    /** 
     * Disables a command from a guild
     * @param {string} guildId The Guild ID
     * @param {string} commandName The command nam
     * @returns {Promise<void>}
     */
    async disable(guildId: string, commandName: string): Promise<void> {
        if (this.isDisabled(guildId, commandName)) return;

        const _id = `${guildId}-${commandName}`
        this._disabledCommands.push(_id);

        try {
            await new disabledCommandsSchema({ _id }).save()
        } catch (ignored) {}
    }

    /** 
     * Enables a command for a guild
     * @param {string} guildId The Guild ID
     * @param {string} commandName The command nam
     * @returns  {Promise<void>}
     */
    async enable(guildId: string, commandName: string): Promise<void> {
        if (!this.isDisabled(guildId, commandName)) return;

        const _id = `${guildId}-${commandName}`
        this._disabledCommands = this._disabledCommands.filter((id) => id !== _id);

        await disabledCommandsSchema.deleteOne({ _id });
    }

    /**
     * Checks if the specified command name with guildId is disabled
     * @param {string} guildId The Guild ID
     * @param {string} commandName The command nam
     * @returns {boolean}
     */
    isDisabled(guildId: string, commandName: string): boolean {
        return this._disabledCommands.includes(`${guildId}-${commandName}`)
    }
}

export default DisabledCommands