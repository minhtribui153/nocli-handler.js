import { Client, AutocompleteInteraction, ApplicationCommandOptionType, PermissionResolvable, ApplicationCommandOptionData } from "discord.js";
import { NoCliCommandType, NoCliCommandTypeString, NoCliCommandCooldown, CommandCallbackOptions } from "./types";
import NoCliHandler from "../..";
import Command from "../../command-handler/Command";

/** The ICommand interface for a command */
export interface ICommand {
    /** Sets the command type */
    type: NoCliCommandType | NoCliCommandTypeString;
    /** Tells the command handler whether to disable this command from interaction with the guilds */
    delete?: boolean;
    /** Runs events inside a command */
    init?: (client: Client, instance: NoCliHandler) => void;
    /** Handles autocomplete interaction for a Slash command */
    autocomplete?: (interaction: AutocompleteInteraction, command: Command, args: string) => string[] | Promise<string[]>;
    /** The description of the command */
    description: string;
    /** The minimum amount of arguments for the command */
    minArgs?: number;
    /** The maximum amount of arguments for the command */
    maxArgs?: number;
    /** 
     * Sends a message specified in correctSyntax if arguments validation failed.
     * 
     * **Annotations:**
     * ```
     * "[PREFIX]" - "The prefix of the command to show"
     * "[ARGS]" - "The arguments of the command to show"
     * ```
     */
    correctSyntax?: string;
    /** The correct syntax on how the arguments should be in place. */
    expectedArgs?: string;
    /** Defines the Slash Command option property for expectedArgs */
    expectedArgsTypes?: ApplicationCommandOptionType[];
    /** The array of permissions the user that ran this command needs */
    permissions?: PermissionResolvable[];
    /** Whether the command is for test guilds  */
    testOnly?: boolean;
    /** Whether the command only works only in guilds  */
    guildOnly?: boolean;
    /** Whether the command is only allowed for bot owners  */
    ownerOnly?: boolean;
    /** Tells the command handler whether to defer command reply */
    deferReply?: boolean | "ephemeral";
    /** Tells the command handler whether to tell the bot to reply or send channel message (only works for Legacy Commands) */
    reply?: boolean;
    /** The command cooldowns */
    cooldowns?: NoCliCommandCooldown;
    /** 
     * The Discord.JS arguments (only works for Slash Commands)
     * Specify this if you are used to handle Discord.JS arguments with Slash Commands.
     */
    options?: ApplicationCommandOptionData[];
    /** The function to execute when the command is called */
    callback: (options: CommandCallbackOptions) => any;
    /** Short-form commands */
    aliases?: string[];
}