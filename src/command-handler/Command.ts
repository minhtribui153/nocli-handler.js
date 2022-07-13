import { ICommand } from '../types';
import NoCliHandler from '..';
import handleError from '../functions/handle-error';

class Command {
    private _commandName: string;
    private _commandObject: ICommand;
    private _instance: NoCliHandler;

    constructor(instance: NoCliHandler, commandName: string, commandObject: ICommand) {
        this._commandName = commandName.toLowerCase();
        this._commandObject = commandObject;
        this._instance = instance;

        try {
            commandObject.init
                ? commandObject.init(this._instance.client)
                : null;
        } catch (err) {
            const showFullErrorLog = this._instance.debug ? this._instance.debug.showFullErrorLog : false;
            handleError(err, showFullErrorLog, this._commandName);
        }
    }

    get instance(): NoCliHandler { return this._instance }
    get commandName(): string { return this._commandName }
    get commandObject(): ICommand { return this._commandObject }
}

export default Command;