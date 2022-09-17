import { ClientEvents, Awaitable } from "discord.js";
import NoCliHandler from "../..";
/** The IEvent interface for an event */
export interface IEvent<Key extends keyof ClientEvents = any> {
    description?: string;
    callback: (instance: NoCliHandler, ...args: ClientEvents[Key]) => Awaitable<void>;
}
