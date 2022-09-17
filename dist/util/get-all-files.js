"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const fs = require('fs');
function getAllFiles(path, foldersOnly = false) {
    const files = fs.readdirSync(path, {
        withFileTypes: true
    });
    let filesFound = [];
    for (const file of files) {
        const fileName = path + '/' + file.name;
        if (file.isDirectory()) {
            if (foldersOnly)
                filesFound.push(fileName);
            else
                filesFound = [...filesFound, ...getAllFiles(fileName)];
            continue;
        }
        filesFound.push(fileName);
    }
    return filesFound;
}
exports.default = getAllFiles;
