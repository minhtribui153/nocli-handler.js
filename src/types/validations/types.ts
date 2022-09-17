import Command from "../../command-handler/Command";
import { CommandCallbackOptions } from "../commands/types";

/** The function type to handle run-time validations */
export type NoCliRuntimeValidationType = (command: Command, usage: CommandCallbackOptions, prefix: string) => boolean;
/** The function type to handle syntax validations */
export type NoCliSyntaxValidationType = (command: Command) => void;