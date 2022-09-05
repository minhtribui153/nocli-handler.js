"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = require("mongoose");
const RequiredRolesSchema = new mongoose_1.Schema({
    _id: {
        type: String,
        required: true
    },
    roles: {
        type: [String],
        required: true
    }
});
const name = 'nocli-handler_required-roles';
exports.default = mongoose_1.models[name] || (0, mongoose_1.model)(name, RequiredRolesSchema);
