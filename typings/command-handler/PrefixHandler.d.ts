import NoCliHandler from "..";
declare class PrefixHandler {
    private _prefixes;
    private _defaultPrefix;
    constructor(instance: NoCliHandler);
    /**
     * Loads the guild prefixes from the database
     */
    loadPrefixes(): Promise<void>;
    get defaultPrefix(): string;
    /**
     * Gets the prefix for a guild
     * @param {string} guildId The Guild ID
     * @returns {string}
     */
    get(guildId?: string): string;
    /**
     * Gets the prefix for a guild
     * @param {string} guildId The Guild ID
     * @param {string} prefix The Guild Prefix
     * @returns {Promise<void>}
     */
    set(guildId: string, prefix: string): Promise<void>;
}
export default PrefixHandler;
