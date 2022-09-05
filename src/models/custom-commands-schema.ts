import { Model, Schema, model, models} from "mongoose";

type CustomCommandSchemaType = {
    /** The ID containing the command and guild ID (Syntax: `guildId-commandName`)*/
    _id: string;
    response: string;
}

const CustomCommandSchema = new Schema<CustomCommandSchemaType>({
    _id: {
        type: String,
        required: true
    },
    response: {
        type: String,
        required: true
    }
})

const name = 'nocli-handler_custom-commands';
export default models[name] as Model<CustomCommandSchemaType> || model(name, CustomCommandSchema);