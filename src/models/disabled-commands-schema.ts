import { Schema, model, models, Model } from "mongoose";

type DisabledCommandSchemaType = {
    _id: string;
}

const DisabledCommandSchema = new Schema<DisabledCommandSchemaType>({
    _id: {
        type: String,
        required: true
    }
});
const name = 'nocli-handler_disabled-commands'

export default models[name] as Model<DisabledCommandSchemaType> || model(name, DisabledCommandSchema)