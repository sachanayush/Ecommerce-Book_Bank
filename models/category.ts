import {Schema, model} from "mongoose";

export interface ICategory {
    name: string,
    description: string,
    image: string[]
}

export const categorySchema = new Schema({
    name: {
        type: String,
        required: true
    },
    description: {
        type: String,
        required: true
    },
    image: {
        type: [String],
        required: true
    }
})

export const Category = model<ICategory>("Category", categorySchema);