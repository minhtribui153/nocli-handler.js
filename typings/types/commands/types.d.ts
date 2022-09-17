import { Client, Message, CommandInteraction, CommandInteractionOptionResolver, Guild, GuildMember, User, Channel, TextBasedChannel } from "discord.js";
import NoCliHandler from "../..";
export declare type CommandOptions = {
    isAlias?: boolean;
    isDefaultCommand?: boolean;
    categoryName?: string;
};
export declare type CommandCallbackOptions = {
    /** The NoCliHandler Instance */
    instance: NoCliHandler;
    /** The Discord.JS Client Instance */
    client: Client;
    /** The Discord.JS Message Instance */
    message: Message | null;
    /** The Discord.JS CommandInteraction Instance  */
    interaction: CommandInteraction | null;
    /** The Discord.JS CommandInteractionOptionResolber Instance */
    options: CommandInteractionOptionResolver | null;
    /** The arguments passed to the command */
    args: string[];
    /** The arguments combined into a string */
    text: string;
    /** The guild the command was ran from  */
    guild: Guild | null;
    /** The guild member who ran this command */
    member: GuildMember | null;
    /** The user who ran this command */
    user: User;
    /** The text channel the command was ran from */
    channel: Channel | TextBasedChannel | null;
    /** Cancels the cooldown for this command */
    cancelCooldown: () => void;
    /** Updates the cooldown for this command */
    updateCooldown: (expires: Date) => void;
};
export declare type NoCliCommandCooldown = {
    /** Sets cooldowns for each user */
    perUser?: string | number;
    /** Sets cooldowns for each user per guild */
    perUserPerGuild?: string | number;
    /** Sets cooldowns for each guild */
    perGuild?: string | number;
    /** Sets cooldowns for every server the user was in */
    global?: string | number;
    /** The cooldown message to send, if any */
    errorMessage?: string;
};
export declare enum NoCliCommandType {
    Slash = 0,
    Legacy = 1,
    Both = 2
}
export declare const NoCliCommandTypeArray: string[];
export declare type NoCliCommandTypeString = keyof typeof NoCliCommandType;
