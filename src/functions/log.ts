import chalk from 'chalk';

export type NoCliLogType = 'info' | 'warn' | 'error';

export const log = (name: string, type: NoCliLogType, ...args: string[]) => {
    if (type === "error") return console.log(chalk["red"](`[${name}]`), args.join(" "));
    else if (type === "warn") return console.log(chalk["yellow"](`[${name}]`), args.join(" "));
    else return console.log(chalk["blue"](`[${name}]`), args.join(" "));
}