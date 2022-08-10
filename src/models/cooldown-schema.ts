import { Schema, model, models, Model } from 'mongoose';

export type CooldownSchemaType = {
    /** The key from Cooldowns.getKey() */
    _id: string;
    /** The date of cooldown expiration */
    expires: Date;
}

const CooldownSchema = new Schema<CooldownSchemaType>({
    _id: {
        type: String,
        required: true,
    },
    expires: {
        type: Date,
        required: true,
    },
});

const name = 'nocli-handler_cooldowns';
export default models[name] as Model<CooldownSchemaType> || model(name, CooldownSchema);