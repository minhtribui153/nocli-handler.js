import NoCliHandler from "..";
import { Client, ClientEvents } from "discord.js";
import { EventConfigurationOptions, IEvent, NoCliLanguageType } from "../types";
/** The nocli-handler.js event handler responsible for handling actions related to Discord.JS Events */
declare class EventHandler {
    private _eventCallbacks;
    private _eventsDir?;
    private _instance;
    private _client;
    private _events?;
    private _builtInEvents;
    private _suffix;
    constructor(instance: NoCliHandler, client: Client, language: NoCliLanguageType, events?: EventConfigurationOptions);
    /** Reads the files from the events directory */
    private readFiles;
    private registerEvents;
    isEvent(object: unknown): object is IEvent<keyof ClientEvents>;
    get eventCallbacks(): Map<string, Array<any>>;
}
export default EventHandler;
