import { ICommand } from '../types';
declare class Command {
    private _commandName;
    private _commandObject;
    constructor(commandName: string, commandObject: ICommand);
    get commandName(): string;
    get commandObject(): ICommand;
    private verifySyntax;
}
export default Command;
