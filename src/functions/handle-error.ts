import { log } from "./log";

export default (error: any, showFullErrorLog: boolean | undefined, argument?: string, type?: "Command" | "Event") => {
    const currentType = type || "Command";
    const fullErrorLog = showFullErrorLog !== undefined
        ? showFullErrorLog
            ? true
            : false
        : false;
    
    if (fullErrorLog) console.log(error.stack);
    else log(`${error.name}${argument ? `: ${currentType} "${argument}"` : ""}`, "error", error.message);

    return process.exit(1);
}