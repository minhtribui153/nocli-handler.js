import { Model } from 'mongoose';
export declare type RequiredRolesSchemaType = {
    /** The ID containing the command and guild ID (Syntax: `guildId-commandName`)*/
    _id: string;
    roles: string[];
};
declare const _default: Model<RequiredRolesSchemaType, {}, {}, {}, any>;
export default _default;
