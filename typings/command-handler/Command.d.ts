import { CommandOptions, ICommand } from '../types';
import NoCliHandler from '..';
declare class Command {
    private _commandName;
    private _categoryName;
    private _commandObject;
    private _instance;
    private _isAlias;
    private _isDefaultCommand;
    constructor(instance: NoCliHandler, commandName: string, commandObject: ICommand, options?: CommandOptions);
    get instance(): NoCliHandler;
    get commandName(): string;
    get categoryName(): string;
    get commandObject(): ICommand;
    get isAnAlias(): boolean;
    get isDefaultCommand(): boolean;
}
export default Command;
