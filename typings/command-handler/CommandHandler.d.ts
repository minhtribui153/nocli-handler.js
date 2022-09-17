import { CommandInteraction, Message } from "discord.js";
import { NoCliLanguageType } from "../types";
import NoCliHandler from "..";
import Command from "./Command";
import SlashCommands from "./SlashCommands";
import ChannelCommands from "./ChannelCommands";
import CustomCommands from "./CustomCommands";
import DisabledCommands from "./DisabledCommands";
import PrefixHandler from "./PrefixHandler";
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
    private getValidations;
    private readFiles;
    isCommand(object: unknown): object is Command;
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
