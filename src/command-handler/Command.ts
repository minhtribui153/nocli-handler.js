import NoCliCommandError from '../errors/NoCliCommandError';
import { ICommand, NoCliLanguageType } from '../types';

class Command {
    private _commandName: string;
    private _commandObject: ICommand;

    constructor(commandName: string, commandObject: ICommand) {
        this._commandName = commandName.toLowerCase();
        this._commandObject = commandObject;
    }

    get commandName(): string { return this._commandName }
    get commandObject(): ICommand { return this._commandObject }
}

export default Command;