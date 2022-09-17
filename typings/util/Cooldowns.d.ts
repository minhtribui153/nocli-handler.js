import { NoCliCooldownKeyOptions, NoCliCooldownOptions, NoCliCooldownType } from "../types";
/** Sets cooldowns for the database and the bot */
declare class Cooldowns {
    private _cooldowns;
    private _instance;
    private _errorMessage;
    private _botOwnersBypass;
    private _dbRequired;
    constructor(options: NoCliCooldownOptions);
    /** Loads all cooldowns from the database */
    loadCooldowns(): Promise<void>;
    getKeyFromCooldownUsage(options: NoCliCooldownKeyOptions): string;
    cancelCooldown(cooldownUsage: NoCliCooldownKeyOptions): Promise<void>;
    updateCooldown(cooldownUsage: NoCliCooldownKeyOptions, expires: Date): Promise<void>;
    /** Verifies the cooldown duration */
    verifyCooldown(duration: string | number): number;
    /** Gets the cooldown key */
    getKey(cooldownType: NoCliCooldownType, userId?: string, actionId?: string, guildId?: string): string;
    /** Checks if user can bypass cooldown integrations */
    canBypass(userId: string): boolean;
    /** Starts the cooldown */
    start(options: NoCliCooldownKeyOptions): Promise<void>;
    canRunAction(options: NoCliCooldownKeyOptions): string | true;
}
export default Cooldowns;
