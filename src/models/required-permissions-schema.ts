import { Schema, Model, model, models } from 'mongoose';

export type RequiredPermissionsSchemaType = {
    /** The ID containing the command and guild ID (Syntax: `guildId-commandName`)*/
    _id: string,
    permissions: string[]
}

const RequiredPermissionsSchema = new Schema<RequiredPermissionsSchemaType>({
    _id: {
        type: String,
        required: true
    },
    permissions: {
        type: [String],
        required: true
    }
});

const name = 'nocli-handler_required-permissions';
export default models[name] as Model<RequiredPermissionsSchemaType> || model(name, RequiredPermissionsSchema)