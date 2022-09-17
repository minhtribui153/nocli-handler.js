declare class DisabledCommands {
    private _disabledCommands;
    constructor();
    loadDisabledCommands(): Promise<void>;
    disable(guildId: string, commandName: string): Promise<void>;
    enable(guildId: string, commandName: string): Promise<void>;
    isDisabled(guildId: string, commandName: string): boolean;
}
export default DisabledCommands;
