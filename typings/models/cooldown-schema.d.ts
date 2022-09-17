import { Model } from 'mongoose';
export declare type CooldownSchemaType = {
    /** The key from Cooldowns.getKey() */
    _id: string;
    /** The date of cooldown expiration */
    expires: Date;
};
declare const _default: Model<CooldownSchemaType, {}, {}, {}, any>;
export default _default;
