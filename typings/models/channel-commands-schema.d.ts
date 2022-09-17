import { Model } from "mongoose";
export declare type ChannelCommandSchemaType = {
    _id: string;
    channels: string[];
};
declare const _default: Model<ChannelCommandSchemaType, {}, {}, {}, any>;
export default _default;
