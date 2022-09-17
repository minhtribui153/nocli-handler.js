import { ClientEvents } from "discord.js";
export declare type EventConfigurationOptions = {
    /** The directory where the events are stored */
    dir?: string;
    /** The dynamic validations to protect events from running */
    validations?: DynamicValidationConfigurationOptions;
};
export declare type DynamicValidationConfigurationOptions = {
    [event in keyof ClientEvents]?: DynamicValidationCheck<event>;
};
export declare type DynamicValidationCheck<K extends keyof ClientEvents> = {
    [func: string]: DynamicValidationCheckFunction<K>;
};
export declare type DynamicValidationCheckFunction<K extends keyof ClientEvents> = (...args: ClientEvents[K]) => boolean;
