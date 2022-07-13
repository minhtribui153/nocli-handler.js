import { log } from "./log";

export default (error: any, showFullErrorLog: boolean | undefined, command?: string) => {
    const fullErrorLog = showFullErrorLog !== undefined
        ? showFullErrorLog
            ? true
            : false
        : false;
    
    if (fullErrorLog) console.log(error.stack);
    else log(`${error.name}${command ? `: Command "${command}"` : ""}`, "error", error.message);

    return process.exit(1);
}