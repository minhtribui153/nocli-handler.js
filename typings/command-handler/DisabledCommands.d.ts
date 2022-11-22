/** The nocli-handler.js feature class to disable commands */
declare class DisabledCommands {
    private _disabledCommands;
    constructor();
    /** Loads the disabled commands */
    loadDisabledCommands(): Promise<void>;
    /**
     * Disables a command from a guild
     * @param {string} guildId The Guild ID
     * @param {string} commandName The command nam
     * @returns {Promise<void>}
     */
    disable(guildId: string, commandName: string): Promise<void>;
    /**
     * Enables a command for a guild
     * @param {string} guildId The Guild ID
     * @param {string} commandName The command nam
     * @returns  {Promise<void>}
     */
    enable(guildId: string, commandName: string): Promise<void>;
    /**
     * Checks if the specified command name with guildId is disabled
     * @param {string} guildId The Guild ID
     * @param {string} commandName The command nam
     * @returns {boolean}
     */
    isDisabled(guildId: string, commandName: string): boolean;
}
export default DisabledCommands;
