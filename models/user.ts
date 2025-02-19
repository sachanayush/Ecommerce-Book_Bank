import mongoose, {Schema, model} from 'mongoose';
import { USER_ROLES } from '../constants/userRoles';

export interface IUser {
   name: string,
   email: string,
   password: string,
   phonNo?: number,
   role: number,
   createdOn: Date,
   updatedOn: Date
}

export const userSchema = new Schema({
   name:{
    type: String,
    required: true
   },
   email:{
    type: String,
    required: true
   },
   password: {
    type: String,
    required: true
   },
   phoneNo:{
    type: Number,
    required: true
   },
   role: {
    type: Number, 
    default: USER_ROLES.USER
   },
   createdOn:{
    type: Date,
    default: Date.now,
   },
   updatedOn:{
    type: Date,
    default: Date.now
   }
});

export const User = model<IUser>('User', userSchema);