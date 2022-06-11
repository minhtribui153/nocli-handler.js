import { ICommand } from '../types';
import NoCliHandler from '..';
declare class Command {
    private _commandName;
    private _commandObject;
    private _instance;
    constructor(instance: NoCliHandler, commandName: string, commandObject: ICommand);
    get instance(): NoCliHandler;
    get commandName(): string;
    get commandObject(): ICommand;
}
export default Command;
