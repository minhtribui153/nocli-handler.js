import { ConnectOptions } from "mongoose";
import NoCliHandler from "../..";
import { NoCliCategoryConfiguration } from "../categories/types";
import { EventConfigurationOptions } from "../events/types";
export declare type NoCliCooldownOptions = {
    instance: NoCliHandler;
    errorMessage?: string;
    botOwnersBypass?: boolean;
    dbRequired?: number;
};
export declare type NoCliCooldownConfigOptions = {
    /** Sets the default error message for cooldowns, if any */
    defaultErrorMessage?: string;
    /** Whether to allow bot owners to bypass cooldowns */
    botOwnersBypass?: boolean;
    /** If a command cooldown exceeds the current cooldown limit set for this option, they will be stored in a MongoDB database  */
    dbRequired?: number;
};
export declare type MongoDBConnection = {
    /** The MongoDB URI */
    uri: string;
    /** The MongoDB options (optional) */
    options?: ConnectOptions;
};
export declare type MongoDBResult = {
    connected: boolean;
    errMessage?: any;
};
export declare type DebugOptions = {
    /** Whether or not to show the full error log */
    showFullErrorLog?: boolean;
    /** Whether or not to show the banner upon the start of the program  */
    showBanner?: boolean;
};
export declare type ConfigOptions = {
    /** The default prefix for the bot (default prefix = "!") */
    defaultPrefix?: string;
    /** The directory where the commands are stored */
    commandsDir?: string;
    /** The configurations for events */
    events?: EventConfigurationOptions;
    /** The configurations for validation plugins */
    validations?: ValidationPluginsOption;
    /** The configurations for command categories */
    categories?: NoCliCategoryConfiguration;
};
export declare type ValidationPluginsOption = {
    /** The directory where runtime validation folders are stored */
    runtime?: string;
    /** The directory where syntax validation folders are stored */
    syntax?: string;
};
export declare type NoCliEmojiConfigOptions = {
    success?: string;
    error?: string;
    info?: string;
    enabled?: string;
    disabled?: string;
};
export declare type NoCliEmojiOptions = {
    success: string;
    error: string;
    info: string;
    enabled: string;
    disabled: string;
};
export declare type NoCliLanguageType = "TypeScript" | "JavaScript";
