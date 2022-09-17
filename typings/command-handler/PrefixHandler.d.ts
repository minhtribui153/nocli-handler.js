import NoCliHandler from "..";
declare class PrefixHandler {
    private _prefixes;
    private _defaultPrefix;
    constructor(instance: NoCliHandler);
    loadPrefixes(): Promise<void>;
    get defaultPrefix(): string;
    get(guildId?: string): string;
    set(guildId: string, prefix: string): Promise<void>;
}
export default PrefixHandler;
