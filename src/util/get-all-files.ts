const fs = require('fs');

export default function getAllFiles(path: string) {
    const files = fs.readdirSync(path, {
        withFileTypes: true
    });
    let commandFiles: string[] = [];

    for (const file of files) {
        if (file.isDirectory()) {
            commandFiles = [...commandFiles, ...getAllFiles(path + '/' + file.name)];
            continue
        }

        commandFiles.push(path + '/' + file.name);
    }

    return commandFiles;
}