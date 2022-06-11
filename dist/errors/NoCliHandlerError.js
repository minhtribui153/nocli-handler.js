"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
class NoCliHandlerError extends Error {
    name = "NoCliHandlerError";
    constructor(msg) {
        super(msg);
        Object.setPrototypeOf(this, NoCliHandlerError.prototype);
    }
}
exports.default = NoCliHandlerError;
