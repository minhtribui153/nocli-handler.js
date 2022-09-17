import { Model } from "mongoose";
declare type CustomCommandSchemaType = {
    /** The ID containing the command and guild ID (Syntax: `guildId-commandName`)*/
    _id: string;
    response: string;
};
declare const _default: Model<CustomCommandSchemaType, {}, {}, {}, any>;
export default _default;
