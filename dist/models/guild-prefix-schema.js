"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = require("mongoose");
const GuildPrefixSchema = new mongoose_1.Schema({
    _id: {
        type: String,
        required: true
    },
    prefix: {
        type: String,
        required: true
    }
});
const name = 'nocli-handler_guild-prefixes';
exports.default = mongoose_1.models[name] || (0, mongoose_1.model)(name, GuildPrefixSchema);
