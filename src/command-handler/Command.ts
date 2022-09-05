import { CommandOptions, ICommand } from '../types';
import NoCliHandler from '..';

class Command {
    private _commandName: string;
    private _commandObject: ICommand;
    private _instance: NoCliHandler;

    private _isAlias: boolean;
    private _isDefaultCommand: boolean;

    constructor(instance: NoCliHandler, commandName: string, commandObject: ICommand, options?: CommandOptions) {
        const { isAlias = false, isDefaultCommand = false } = options ? options : {};
        this._commandName = commandName.toLowerCase();
        this._commandObject = commandObject;
        this._instance = instance;
        
        this._isAlias = isAlias;
        this._isDefaultCommand = isDefaultCommand
    }

    get instance(): NoCliHandler { return this._instance }
    get commandName(): string { return this._commandName }
    get commandObject(): ICommand { return this._commandObject }
    get isAnAlias(): boolean { return this._isAlias }
    get isDefaultCommand(): boolean { return this._isDefaultCommand }
}

export default Command;