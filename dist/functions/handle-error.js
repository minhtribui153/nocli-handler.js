"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const log_1 = require("./log");
exports.default = (error, showFullErrorLog, argument, type) => {
    const currentType = type || "Command";
    const fullErrorLog = showFullErrorLog !== undefined
        ? showFullErrorLog
            ? true
            : false
        : false;
    if (fullErrorLog)
        console.log(error.stack);
    else
        (0, log_1.log)(`${error.name}${argument ? `: ${currentType} "${argument}"` : ""}`, "error", error.message);
    return process.exit(1);
};
