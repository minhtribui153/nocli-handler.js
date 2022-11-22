import { CommandInteraction, Message } from "discord.js";
import { NoCliLanguageType } from "../types";
import NoCliHandler from "..";
import Command from "./Command";
import SlashCommands from "./SlashCommands";
import ChannelCommands from "./ChannelCommands";
import CustomCommands from "./CustomCommands";
import DisabledCommands from "./DisabledCommands";
import PrefixHandler from "./PrefixHandler";
/** The nocli-handler.js command handler responsible for handling actions related to commands */
declare class CommandHandler {
    commands: Map<string, Command>;
    commandsDir: string;
    private _suffix;
    private _debugging;
    private _instance;
    private _slashCommands;
    private _channelCommands;
    private _customCommands;
    private _disabledCommands;
    private _prefixes;
    private _validations;
    get channelCommands(): ChannelCommands;
    get customCommands(): CustomCommands;
    get slashCommands(): SlashCommands;
    get prefixHandler(): PrefixHandler;
    get disabledCommands(): DisabledCommands;
    constructor(instance: NoCliHandler, commandsDir: string, language: NoCliLanguageType);
    /**
     * Gets the validations from a folder
     * @param {string} folder The path to the validation folder
     * @returns {Promise<T>[]}
     */
    private getValidations;
    /** Reads the files from the commands directory */
    private readFiles;
    /**
     * Checks if the specified object is a Command instance
     * @param {unknown} object The object to check
     * @returns {object is Command}
     */
    isCommand(object: unknown): object is Command;
    /**
     * Runs the Command instance
     * @param {Command} command The command instance
     * @param {string[]} args The command arguments
     * @param {Message | null} message The Message instance
     * @param {CommandInteraction | null} interaction  The CommandInteraction instance
     * @returns
     */
    runCommand(command: Command, args: string[], message: Message | null, interaction: CommandInteraction | null): Promise<{
        response: string;
        reply: boolean;
        deferReply?: undefined;
    } | {
        response: any;
        deferReply: boolean | "ephemeral";
        reply: boolean;
    } | undefined>;
}
export default CommandHandler;
