"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.NoCliCommandType = exports.cooldownTypesArray = void 0;
// Arrays
exports.cooldownTypesArray = ['perUser', 'perUserPerGuild', 'perGuild', 'global'];
var NoCliCommandType;
(function (NoCliCommandType) {
    NoCliCommandType[NoCliCommandType["Slash"] = 0] = "Slash";
    NoCliCommandType[NoCliCommandType["Legacy"] = 1] = "Legacy";
    NoCliCommandType[NoCliCommandType["Both"] = 2] = "Both";
})(NoCliCommandType = exports.NoCliCommandType || (exports.NoCliCommandType = {}));
;
