"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var Command = /** @class */ (function () {
    function Command(commandName, commandObject) {
        this._commandName = commandName.toLowerCase();
        this._commandObject = commandObject;
    }
    Object.defineProperty(Command.prototype, "commandName", {
        get: function () { return this._commandName; },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(Command.prototype, "commandObject", {
        get: function () { return this._commandObject; },
        enumerable: false,
        configurable: true
    });
    return Command;
}());
exports.default = Command;
