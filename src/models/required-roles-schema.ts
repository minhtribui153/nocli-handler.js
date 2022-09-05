import { Schema, Model, model, models } from 'mongoose';

export type RequiredRolesSchemaType = {
    /** The ID containing the command and guild ID (Syntax: `guildId-commandName`)*/
    _id: string,
    roles: string[]
}

const RequiredRolesSchema = new Schema<RequiredRolesSchemaType>({
    _id: {
        type: String,
        required: true
    },
    roles: {
        type: [String],
        required: true
    }
});

const name = 'nocli-handler_required-roles';
export default models[name] as Model<RequiredRolesSchemaType> || model(name, RequiredRolesSchema)