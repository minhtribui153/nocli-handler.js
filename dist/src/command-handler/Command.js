"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
var NoCliCommandError_1 = __importDefault(require("../errors/NoCliCommandError"));
var Command = /** @class */ (function () {
    function Command(commandName, commandObject) {
        this._commandName = commandName.toLowerCase();
        this._commandObject = commandObject;
        this.verifySyntax();
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
    Command.prototype.verifySyntax = function () {
        if (!this._commandObject.description)
            throw new NoCliCommandError_1.default("Command \"".concat(this._commandName, "\" does not have a description!"));
        if (!this._commandObject.callback)
            throw new NoCliCommandError_1.default("Command \"".concat(this._commandName, "\" does not have a callback function"));
    };
    return Command;
}());
exports.default = Command;
