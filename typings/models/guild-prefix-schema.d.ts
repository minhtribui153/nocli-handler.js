import { Model } from "mongoose";
declare type GuildPrefixSchemaType = {
    _id: string;
    prefix: string;
};
declare const _default: Model<GuildPrefixSchemaType, {}, {}, {}, any>;
export default _default;
