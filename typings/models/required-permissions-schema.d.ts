import { Model } from 'mongoose';
export declare type RequiredPermissionsSchemaType = {
    /** The ID containing the command and guild ID (Syntax: `guildId-commandName`)*/
    _id: string;
    permissions: string[];
};
declare const _default: Model<RequiredPermissionsSchemaType, {}, {}, {}, any>;
export default _default;
