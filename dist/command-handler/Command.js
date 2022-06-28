"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
class Command {
    _commandName;
    _commandObject;
    _instance;
    constructor(instance, commandName, commandObject) {
        this._commandName = commandName.toLowerCase();
        this._commandObject = commandObject;
        this._instance = instance;
        commandObject.init
            ? commandObject.init(this._instance.client)
            : null;
    }
    get instance() { return this._instance; }
    get commandName() { return this._commandName; }
    get commandObject() { return this._commandObject; }
}
exports.default = Command;
