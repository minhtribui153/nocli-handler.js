import { Client } from "discord.js";
import { IFeature, NoCliLanguageType } from "../types";
import NoCliHandler from "..";
import getAllFiles from "./get-all-files";
import importFile from "./import-file";
import handleError from "../functions/handle-error";

class FeatureHandler {
    private _suffix: "ts" | "js";

    constructor (instance: NoCliHandler, featuresDir: string, client: Client, language: NoCliLanguageType) {
        this._suffix = language === "TypeScript" ? "ts" : "js";
        this.readFiles(instance, featuresDir, client).catch((err) => {
            const error = err as any;
            const showFullErrorLog = instance.debugging !== undefined ? instance.debugging.showFullErrorLog : false;
            handleError(error, showFullErrorLog);
        })
    }

    async readFiles(instance: NoCliHandler, featuresDir: string, client: Client) {
        const files = getAllFiles(featuresDir);

        for (const file of files) {
            if (file.endsWith(this._suffix)) {
                const func = this._suffix === "js"
                    ? require(file) as IFeature
                    : importFile<IFeature>(file)
                
                if (this.isFeature(func)) {
                    await func(instance, client);
                }
            }
        }
    }

    isFeature(object: unknown): object is IFeature {
        return object instanceof Function && Object.prototype.hasOwnProperty.call(object, "instance") && Object.prototype.hasOwnProperty.call(object, "client")
    }
}

export default FeatureHandler;