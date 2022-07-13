"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const handle_error_1 = __importDefault(require("../functions/handle-error"));
class Command {
    _commandName;
    _commandObject;
    _instance;
    constructor(instance, commandName, commandObject) {
        this._commandName = commandName.toLowerCase();
        this._commandObject = commandObject;
        this._instance = instance;
        try {
            commandObject.init
                ? commandObject.init(this._instance.client)
                : null;
        }
        catch (err) {
            const showFullErrorLog = this._instance.debug ? this._instance.debug.showFullErrorLog : false;
            (0, handle_error_1.default)(err, showFullErrorLog, this._commandName);
        }
    }
    get instance() { return this._instance; }
    get commandName() { return this._commandName; }
    get commandObject() { return this._commandObject; }
}
exports.default = Command;
