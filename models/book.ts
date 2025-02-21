import {Schema, model, Types} from 'mongoose';

interface IImageProperty{
    name: String,
    imageURL: String
}

interface IDescription{
    short: string,
    long: string
}

export interface IBook {
    _id ?:unknown;
    author?: Types.ObjectId;
    title?: String;
    description?: IDescription;
    price?: Number;
    edition?: Types.ObjectId;
    images?: Array<IImageProperty>;
    category?: Types.ObjectId;
    pages?: Number;
    // createdAt: Date;
}

const descriptionSchema = new Schema({
     short: String,
     long: String
})

const imageSchema = new Schema({
    name: {
        type: String,
        required: true
    },
    imageURL: {
        type: String,
        required: true
    }
})

export const bookSchema = new Schema({
    title: {
          type: String,
          required: true
    },
    author: {
        type: Types.ObjectId,
        ref: "Author",
        // required: true
    },
    description: {
        type: descriptionSchema,
        // required: true
    },
    price: {
          type: Number,
          require: true
    },
    edition: {
            type: Types.ObjectId,
            ref: "Edition",
            // required: true
    },
    images: {
           type: [imageSchema]
    },
    category: {
             type: Types.ObjectId,
             ref: "Category",
            //  required: true
    },
    pages: {
          type: Number
    },
    createdAt: {
        type: Date,
        default: Date.now()
    }
});

export const Book = model<IBook>("Book", bookSchema);