import { Schema, model, models, Model } from "mongoose";

type GuildPrefixSchemaType = {
    _id: string;
    prefix: string;
}

const GuildPrefixSchema = new Schema<GuildPrefixSchemaType>({
    _id: {
        type: String,
        required: true
    },
    prefix: {
        type: String,
        required: true
    }
});

const name = 'nocli-handler_guild-prefixes'

export default models[name] as Model<GuildPrefixSchemaType> || model(name, GuildPrefixSchema)