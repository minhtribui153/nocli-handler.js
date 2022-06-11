"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const NoCliHandlerError_1 = __importDefault(require("./NoCliHandlerError"));
class NoCliCommandError extends NoCliHandlerError_1.default {
    name = "NoCliCommandError";
    constructor(msg) {
        super(msg);
    }
}
exports.default = NoCliCommandError;
