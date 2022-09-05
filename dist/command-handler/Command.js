"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
class Command {
    _commandName;
    _commandObject;
    _instance;
    _isAlias;
    _isDefaultCommand;
    constructor(instance, commandName, commandObject, options) {
        const { isAlias = false, isDefaultCommand = false } = options ? options : {};
        this._commandName = commandName.toLowerCase();
        this._commandObject = commandObject;
        this._instance = instance;
        this._isAlias = isAlias;
        this._isDefaultCommand = isDefaultCommand;
    }
    get instance() { return this._instance; }
    get commandName() { return this._commandName; }
    get commandObject() { return this._commandObject; }
    get isAnAlias() { return this._isAlias; }
    get isDefaultCommand() { return this._isDefaultCommand; }
}
exports.default = Command;
