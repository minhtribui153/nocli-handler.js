import { Client } from "discord.js";
import { IFeature, NoCliLanguageType } from "../types";
import NoCliHandler from "..";
declare class FeatureHandler {
    private _suffix;
    constructor(instance: NoCliHandler, featuresDir: string, client: Client, language: NoCliLanguageType);
    readFiles(instance: NoCliHandler, featuresDir: string, client: Client): Promise<void>;
    isFeature(object: unknown): object is IFeature;
}
export default FeatureHandler;
