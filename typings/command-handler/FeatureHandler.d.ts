import { Client } from "discord.js";
import NoCliHandler from "..";
declare class FeatureHandler {
    constructor(instance: NoCliHandler, featuresDir: string, client: Client);
    readFiles(instance: NoCliHandler, featuresDir: string, client: Client): Promise<void>;
}
export default FeatureHandler;
