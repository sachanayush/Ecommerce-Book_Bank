import {Schema, model} from "mongoose";

export interface IEdition{
    ageGroup: number,
    language: string
}

export const editionSchema = new Schema({
     ageGroup:{
        type: Number,
        required: true
     },
     language:{
        type: String,
        required: true
     }
});

export const edition = model<IEdition>("Edition", editionSchema);