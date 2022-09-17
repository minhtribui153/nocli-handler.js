import { ClientEvents } from "discord.js";

export type EventConfigurationOptions = {
    /** The directory where the events are stored */
    dir?: string;
    /** The dynamic validations to protect events from running */
    validations?: DynamicValidationConfigurationOptions
}

export type DynamicValidationConfigurationOptions = { [event in keyof ClientEvents]?: DynamicValidationCheck<event> }
export type DynamicValidationCheck<K extends keyof ClientEvents> = { [func: string]: DynamicValidationCheckFunction<K> }
export type DynamicValidationCheckFunction<K extends keyof ClientEvents> = (...args: ClientEvents[K]) => boolean;