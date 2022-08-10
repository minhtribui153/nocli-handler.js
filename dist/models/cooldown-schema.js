"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = require("mongoose");
const CooldownSchema = new mongoose_1.Schema({
    _id: {
        type: String,
        required: true,
    },
    expires: {
        type: Date,
        required: true,
    },
});
const name = 'nocli-handler_cooldowns';
exports.default = mongoose_1.models[name] || (0, mongoose_1.model)(name, CooldownSchema);
