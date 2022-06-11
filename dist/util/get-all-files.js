"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const fs = require('fs');
function getAllFiles(path) {
    const files = fs.readdirSync(path, {
        withFileTypes: true
    });
    let commandFiles = [];
    for (const file of files) {
        if (file.isDirectory()) {
            commandFiles = [...commandFiles, ...getAllFiles(path + '/' + file.name)];
            continue;
        }
        commandFiles.push(path + '/' + file.name);
    }
    return commandFiles;
}
exports.default = getAllFiles;
