import chalk from 'chalk';

export type NoCliLogType = 'info' | 'warn' | 'error';

type NoCliLogColorType = "red" | "blue" | "yellow";

const handleColorType = (type: NoCliLogType): NoCliLogColorType => {
    switch (type) {
        case 'info':
            return "blue";
        case 'warn':
            return "yellow";
        case 'error':
            return "red";
    }
}

export const log = (name: string, type: NoCliLogType, ...args: string[]) => {
    const time = new Date().toLocaleTimeString();
    const color = handleColorType(type);
    const infoType = `[${name}]`;
    const timeType = `[${time}]`;
    console.log(chalk.bold["grey"](timeType) + chalk.bold[color](infoType), args.join(" "))
    return;
}