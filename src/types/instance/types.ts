import { ConnectOptions } from "mongoose";
import NoCliHandler from "../..";
import { NoCliCategoryConfiguration } from "../categories/types";
import { EventConfigurationOptions } from "../events/types";

export type NoCliCooldownOptions = {
    instance: NoCliHandler;
    errorMessage?: string;
    botOwnersBypass?: boolean;
    dbRequired?: number;
}

export type NoCliCooldownConfigOptions = {
    /** Sets the default error message for cooldowns, if any */
    defaultErrorMessage?: string;
    /** Whether to allow bot owners to bypass cooldowns */
    botOwnersBypass?: boolean;
    /** If a command cooldown exceeds the current cooldown limit set for this option, they will be stored in a MongoDB database  */
    dbRequired?: number;
}


export type MongoDBConnection = {
    /** The MongoDB URI */
    uri: string;
    /** The MongoDB options (optional) */
    options?: ConnectOptions;
}

export type MongoDBResult = {
    connected: boolean;
    errMessage?: any;
}

export type DebugOptions = {
    /** Whether or not to show the full error log */
    showFullErrorLog?: boolean;
    /** Whether or not to show the banner upon the start of the program  */
    showBanner?: boolean;
}

export type ConfigOptions = {
    /** The default prefix for the bot (default prefix = "!") */
    defaultPrefix?: string;
    /** The directory where the commands are stored */
    commandsDir?: string;
    /** The directory where the features are stored */
    featuresDir?: string;
    /** The configurations for events */
    events?: EventConfigurationOptions;
    /** The configurations for validation plugins */
    validations?: ValidationPluginsOption;
    /** The configurations for command categories */
    categories?: NoCliCategoryConfiguration;
    /** Whether to enable sharding for the bot (only necessary if your bot reaches more than 2000 servers) */
    sharding: boolean;
}

export type ValidationPluginsOption = {
    /** The directory where runtime validation folders are stored */
    runtime?: string;
    /** The directory where syntax validation folders are stored */
    syntax?: string;
}

export type NoCliEmojiConfigOptions = {
    success?: string;
    error?: string;
    info?: string;
    enabled?: string;
    disabled?: string;
}

export type NoCliEmojiOptions = {
    success: string;
    error: string;
    info: string;
    enabled: string;
    disabled: string;
}

export type NoCliLanguageType = "TypeScript" | "JavaScript";