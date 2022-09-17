export declare const cooldownTypesArray: readonly ["perUser", "perUserPerGuild", "perGuild", "global"];
export declare type NoCliCooldownType = typeof cooldownTypesArray[number];
export declare type NoCliCooldownKeyOptions = {
    cooldownType: NoCliCooldownType;
    userId: string;
    actionId: string;
    guildId?: string;
    duration?: string | number;
    errorMessage?: string;
};
