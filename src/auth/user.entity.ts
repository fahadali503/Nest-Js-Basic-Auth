import { ModelOptions, prop } from "@typegoose/typegoose";
import { Exclude, Expose } from "class-transformer";


@ModelOptions({ schemaOptions: { timestamps: true } })
export class User {
    @prop({ type: String })
    fullName: string;

    @prop({ type: String, unique: true })
    username: string;

    @prop({ type: String, unique: true })
    email: string;

    @Exclude()
    @prop({ type: String })
    password: string
}