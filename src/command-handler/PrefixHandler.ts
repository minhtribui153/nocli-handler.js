import NoCliHandler from "..";
import guildPrefixSchema from "../models/guild-prefix-schema";

class PrefixHandler {
    // <guildId: prefix>
    private _prefixes = new Map<string, string>()
    private _defaultPrefix: string;

    constructor(instance: NoCliHandler) {
        this._defaultPrefix = instance.defaultPrefix;
    }
    
    /**
     * Loads the guild prefixes from the database
     */
    async loadPrefixes() {
        const results = await guildPrefixSchema.find({});

        for (const result of results) this._prefixes.set(result._id, result.prefix);
    }

    get defaultPrefix() { return this._defaultPrefix }

    /**
     * Gets the prefix for a guild
     * @param {string} guildId The Guild ID
     * @returns {string}
     */
    get(guildId?: string): string {
        if (!guildId) return this.defaultPrefix;

        return this._prefixes.get(guildId) || this.defaultPrefix;
    }

    /**
     * Gets the prefix for a guild
     * @param {string} guildId The Guild ID
     * @param {string} prefix The Guild Prefix
     * @returns {Promise<void>}
     */
    async set(guildId: string, prefix: string): Promise<void> {
        this._prefixes.set(guildId, prefix)

        await guildPrefixSchema.findOneAndUpdate(
            {
                _id: guildId
            },
            {
                _id: guildId,
                prefix
            },
            {
                upsert: true
            }
        )
    }
}

export default PrefixHandler;