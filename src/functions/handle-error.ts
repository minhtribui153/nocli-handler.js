import { log } from "./log";

export default (error: any, showFullErrorLog: boolean | undefined) => {
    const fullErrorLog = showFullErrorLog !== undefined
        ? showFullErrorLog
            ? true
            : false
        : false;
    
    if (fullErrorLog) console.error(error);
    else log(error.name, "error", error.message);

    return process.exit(1);
}