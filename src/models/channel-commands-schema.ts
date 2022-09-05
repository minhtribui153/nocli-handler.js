import { Schema, model, models, Model } from "mongoose";

export type ChannelCommandSchemaType = {
    _id: string;
    channels: string[];
}

const ChannelCommandSchema = new Schema<ChannelCommandSchemaType>({
    _id: {
        type: String,
        required: true
    },
    channels: {
        type: [String],
        required: true
    }
});

const name = 'nocli-handler_channel-commands';
export default models[name] as Model<ChannelCommandSchemaType> || model(name, ChannelCommandSchema)