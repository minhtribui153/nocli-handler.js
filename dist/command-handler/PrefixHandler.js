"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const guild_prefix_schema_1 = __importDefault(require("../models/guild-prefix-schema"));
class PrefixHandler {
    // <guildId: prefix>
    _prefixes = new Map();
    _defaultPrefix;
    constructor(instance) {
        this._defaultPrefix = instance.defaultPrefix;
    }
    /**
     * Loads the guild prefixes from the database
     */
    async loadPrefixes() {
        const results = await guild_prefix_schema_1.default.find({});
        for (const result of results)
            this._prefixes.set(result._id, result.prefix);
    }
    get defaultPrefix() { return this._defaultPrefix; }
    /**
     * Gets the prefix for a guild
     * @param {string} guildId The Guild ID
     * @returns {string}
     */
    get(guildId) {
        if (!guildId)
            return this.defaultPrefix;
        return this._prefixes.get(guildId) || this.defaultPrefix;
    }
    /**
     * Gets the prefix for a guild
     * @param {string} guildId The Guild ID
     * @param {string} prefix The Guild Prefix
     * @returns {Promise<void>}
     */
    async set(guildId, prefix) {
        this._prefixes.set(guildId, prefix);
        await guild_prefix_schema_1.default.findOneAndUpdate({
            _id: guildId
        }, {
            _id: guildId,
            prefix
        }, {
            upsert: true
        });
    }
}
exports.default = PrefixHandler;
