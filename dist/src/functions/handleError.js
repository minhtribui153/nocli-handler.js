"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var log_1 = require("./log");
exports.default = (function (error, showFullErrorLog) {
    var fullErrorLog = showFullErrorLog !== undefined
        ? showFullErrorLog
            ? true
            : false
        : false;
    if (fullErrorLog)
        console.error(error);
    else
        (0, log_1.log)(error.name, "error", error.message);
    return process.exit(1);
});
