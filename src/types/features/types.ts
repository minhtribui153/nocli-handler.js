import { Client } from "discord.js";
import NoCliHandler from "../..";

export type IFeature = (instance: NoCliHandler, client: Client) => void;