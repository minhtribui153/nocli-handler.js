import NoCliHandler from "..";
import handleError from "../functions/handle-error";
import { Client, ClientEvents, InteractionType } from "discord.js";
import { DynamicValidationConfigurationOptions, EventConfigurationOptions, IEvent, NoCliLanguageType } from "../types"

import getAllFiles from "../util/get-all-files";
import path from "path";
import importFile from "../util/import-file";
import NoCliEventError from "../errors/NoCliEventError";

/** The nocli-handler.js event handler responsible for handling actions related to Discord.JS Events */
class EventHandler {
    // <eventName, array of [function, dynamic validation functions]>
    private _eventCallbacks = new Map<string, Array<any>[]>();
    private _eventsDir?: string;

    private _instance: NoCliHandler;
    private _client: Client;

    private _events?: Omit<EventConfigurationOptions, "dir">
    private _builtInEvents: DynamicValidationConfigurationOptions;

    private _suffix: "js" | "ts";

    constructor(instance: NoCliHandler, client: Client, language: NoCliLanguageType, events?: EventConfigurationOptions) {
        this._instance = instance;
        this._eventsDir = events?.dir;
        this._client = client;

        this._suffix = language === "TypeScript" ? "ts" : "js";
        this._builtInEvents = {
            interactionCreate: {
                isCommand: interaction => interaction.isChatInputCommand() || interaction.isAutocomplete()
            },
            messageCreate: {
                isHuman: message => !message.author.bot
            }
        }

        if (events) {
            delete events.dir;
            this._events = events;
        }

        this.readFiles()

        //handleError(err, showFullErrorLog);
    }

    /** Reads the files from the events directory */
    private async readFiles() {
        try {
            const defaultEvents = getAllFiles(path.join(__dirname, 'events'), true);
            const folders = this._eventsDir ? getAllFiles(this._eventsDir, true) : [];
            for (const folderPath of [...defaultEvents, ...folders]) {
                const event = folderPath.split(/[\/\\]/g).pop()! as keyof ClientEvents;
                const files = getAllFiles(folderPath)

                const objects = this._eventCallbacks.get(event) || [];

                for (const file of files) {
                    const isBuiltIn = !folderPath.includes(this._eventsDir || "")
                    const obj = this._suffix === "js" && !isBuiltIn
                        ? require(file) as IEvent<keyof ClientEvents> | undefined
                        : await importFile<IEvent<keyof ClientEvents> | undefined>(file);

                    // @ts-ignore
                    const result = [obj];
                    
                    // TODO: Add in the dynamic validation system
                    const split = file.split(event)[1].split(/[\/\\]/g);
                    const methodName = split[split.length - 2];

                    if (!this.isEvent(obj)) {
                        const name = file.split(/[\/\\]/g).pop()!
                        throw new NoCliEventError(`Event in ${event}/${methodName ? `${methodName}/` : ""}${name} has no callback`)
                    }

                    const validationEvent = this._events ? this._events.validations ? this._events.validations[event] : undefined  : undefined;

                    if (isBuiltIn) {
                        const validationEvent = this._builtInEvents[event]
                        if (validationEvent && validationEvent[methodName] !== undefined) {
                            // @ts-ignore
                            result.push(validationEvent[methodName]);
                        }
                    } else if (validationEvent && validationEvent[methodName] !== undefined) {
                        // @ts-ignore
                        result.push(validationEvent[methodName]);
                    }

                    objects.push(result)
                }

                this._eventCallbacks.set(event, objects)
            }

            this.registerEvents()
        } catch (err) {
            const showFullErrorLog = this._instance.debug ? this._instance.debug.showFullErrorLog : false;
            handleError(err, showFullErrorLog);
        }
    }

    private registerEvents() {
        const instance = this._instance;

        for (const eventName of this._eventCallbacks.keys()) {
            const objects = this._eventCallbacks.get(eventName)!

            this._client.on(eventName, async function () {
                for (const [obj, dynamicValidation] of objects) {
                    if (dynamicValidation && !(await dynamicValidation(...arguments))) continue
                    obj.callback(instance, ...arguments)
                }
            })
        }
    }

    isEvent(object: unknown): object is IEvent<keyof ClientEvents> {
        return Object.prototype.hasOwnProperty.call(object, "callback")
    }

    public get eventCallbacks(): Map<string, Array<any>> { return this._eventCallbacks }
}

export default EventHandler;