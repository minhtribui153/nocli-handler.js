"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const handle_error_1 = __importDefault(require("../functions/handle-error"));
const get_all_files_1 = __importDefault(require("../util/get-all-files"));
const path_1 = __importDefault(require("path"));
const import_file_1 = __importDefault(require("../util/import-file"));
const NoCliEventError_1 = __importDefault(require("../errors/NoCliEventError"));
class EventHandler {
    // <eventName, array of [function, dynamic validation functions]>
    _eventCallbacks = new Map();
    _eventsDir;
    _instance;
    _client;
    _events;
    _builtInEvents;
    _suffix;
    constructor(instance, client, language, events) {
        this._instance = instance;
        this._eventsDir = events?.dir;
        this._client = client;
        this._suffix = language === "TypeScript" ? "ts" : "js";
        this._builtInEvents = {
            interactionCreate: {
                isCommand: interaction => interaction.isChatInputCommand()
            },
            messageCreate: {
                isHuman: message => !message.author.bot
            }
        };
        if (events) {
            delete events.dir;
            this._events = events;
        }
        this.readFiles();
        //handleError(err, showFullErrorLog);
    }
    async readFiles() {
        try {
            const defaultEvents = (0, get_all_files_1.default)(path_1.default.join(__dirname, 'events'), true);
            const folders = this._eventsDir ? (0, get_all_files_1.default)(this._eventsDir, true) : [];
            for (const folderPath of [...defaultEvents, ...folders]) {
                const event = folderPath.split(/[\/\\]/g).pop();
                const files = (0, get_all_files_1.default)(folderPath);
                const objects = this._eventCallbacks.get(event) || [];
                for (const file of files) {
                    const isBuiltIn = !folderPath.includes(this._eventsDir || "");
                    const obj = this._suffix === "js" && !isBuiltIn
                        ? require(file)
                        : await (0, import_file_1.default)(file);
                    // @ts-ignore
                    const result = [obj];
                    // TODO: Add in the dynamic validation system
                    const split = file.split(event)[1].split(/[\/\\]/g);
                    const methodName = split[split.length - 2];
                    if (!this.isEvent(obj)) {
                        const name = file.split(/[\/\\]/g).pop();
                        throw new NoCliEventError_1.default(`Event in ${event}/${methodName ? `${methodName}/` : ""}${name} has no callback`);
                    }
                    const validationEvent = this._events ? this._events.validations ? this._events.validations[event] : undefined : undefined;
                    if (isBuiltIn) {
                        const validationEvent = this._builtInEvents[event];
                        if (validationEvent && validationEvent[methodName] !== undefined) {
                            // @ts-ignore
                            result.push(validationEvent[methodName]);
                        }
                    }
                    else if (validationEvent && validationEvent[methodName] !== undefined) {
                        // @ts-ignore
                        result.push(validationEvent[methodName]);
                    }
                    objects.push(result);
                }
                this._eventCallbacks.set(event, objects);
            }
            this.registerEvents();
        }
        catch (err) {
            const showFullErrorLog = this._instance.debug ? this._instance.debug.showFullErrorLog : false;
            (0, handle_error_1.default)(err, showFullErrorLog);
        }
    }
    registerEvents() {
        const instance = this._instance;
        for (const eventName of this._eventCallbacks.keys()) {
            const objects = this._eventCallbacks.get(eventName);
            this._client.on(eventName, async function () {
                for (const [obj, dynamicValidation] of objects) {
                    if (dynamicValidation && !(await dynamicValidation(...arguments)))
                        continue;
                    obj.callback(instance, ...arguments);
                }
            });
        }
    }
    isEvent(object) {
        return Object.prototype.hasOwnProperty.call(object, "callback");
    }
    get eventCallbacks() { return this._eventCallbacks; }
}
exports.default = EventHandler;
