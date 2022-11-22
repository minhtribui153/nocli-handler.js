"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
/** The default nocli-handler.js command class used for command initialization */
class Command {
    _commandName;
    _categoryName;
    _commandObject;
    _instance;
    _isAlias;
    _isDefaultCommand;
    constructor(instance, commandName, commandObject, options) {
        const { isAlias = false, isDefaultCommand = false, categoryName = "Misc" } = options ? options : {};
        this._commandName = commandName.toLowerCase();
        this._categoryName = categoryName;
        this._commandObject = commandObject;
        this._instance = instance;
        this._isAlias = isAlias;
        this._isDefaultCommand = isDefaultCommand;
        if (this._isDefaultCommand)
            this._categoryName = "Default";
    }
    get instance() { return this._instance; }
    get commandName() { return this._commandName; }
    get categoryName() { return this._categoryName; }
    get commandObject() { return this._commandObject; }
    get isAnAlias() { return this._isAlias; }
    get isDefaultCommand() { return this._isDefaultCommand; }
}
exports.default = Command;
