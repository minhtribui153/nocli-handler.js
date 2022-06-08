"use strict";
var __spreadArray = (this && this.__spreadArray) || function (to, from, pack) {
    if (pack || arguments.length === 2) for (var i = 0, l = from.length, ar; i < l; i++) {
        if (ar || !(i in from)) {
            if (!ar) ar = Array.prototype.slice.call(from, 0, i);
            ar[i] = from[i];
        }
    }
    return to.concat(ar || Array.prototype.slice.call(from));
};
Object.defineProperty(exports, "__esModule", { value: true });
var fs = require('fs');
function getAllFiles(path) {
    var files = fs.readdirSync(path, {
        withFileTypes: true
    });
    var commandFiles = [];
    for (var _i = 0, files_1 = files; _i < files_1.length; _i++) {
        var file = files_1[_i];
        if (file.isDirectory()) {
            commandFiles = __spreadArray(__spreadArray([], commandFiles, true), getAllFiles(path + '/' + file.name), true);
            continue;
        }
        commandFiles.push(path + '/' + file.name);
    }
    return commandFiles;
}
exports.default = getAllFiles;
