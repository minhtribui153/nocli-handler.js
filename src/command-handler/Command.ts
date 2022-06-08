import NoCliCommandError from '../errors/NoCliCommandError';
import { ICommand } from '../types';

class Command {
    private _commandName: string;
    private _commandObject: ICommand;
    constructor(commandName: string, commandObject: ICommand) {
        this._commandName = commandName.toLowerCase();
        this._commandObject = commandObject;
        this.verifySyntax()
    }

    get commandName(): string { return this._commandName }
    get commandObject(): ICommand { return this._commandObject }

    private verifySyntax() {
        if (!this._commandObject.description) throw new NoCliCommandError(`Command "${this._commandName}" does not have a description!`);
        if (!this._commandObject.callback) throw new NoCliCommandError(`Command "${this._commandName}" does not have a callback function`);
    }
}

export default Command;