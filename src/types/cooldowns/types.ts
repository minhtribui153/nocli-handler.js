export const cooldownTypesArray = ['perUser', 'perUserPerGuild', 'perGuild', 'global'] as const;

export type NoCliCooldownType = typeof cooldownTypesArray[number]

export type NoCliCooldownKeyOptions = {
    cooldownType: NoCliCooldownType;
    userId: string;
    actionId: string;
    guildId?: string;
    duration?: string | number;
    errorMessage?: string;
}