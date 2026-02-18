import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import { HydratedDocument } from "mongoose";

export type UserDocument = HydratedDocument<User>;

@Schema()
export class User {
    
    @Prop()
    id:number;

    @Prop({
        required:true,
        unique:true,
    })
    email:string;

    @Prop({
        required:true,
    })
    name:string;

    @Prop({
        required:true,
        select:false
    })
    password:string;

    @Prop({
        select:false
    })
    salt:string;

}
export const UserSchema = SchemaFactory.createForClass(User);
UserSchema.index({ email: 1, firstName: 1 }, { unique: true });
