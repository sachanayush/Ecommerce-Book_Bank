import mongoose, {Document, Model} from "mongoose";

export class MongoDao<T extends Partial<mongoose.Document>>{
    private model: mongoose.Model<T>

    constructor(model: mongoose.Model<T>){
        this.model = model;
    }

    getModel() : mongoose.Model<T>{
        return this.model;
    }

    async getAll(): Promise<T[]> {
        return await this.model.find({});
    }
    
    async findOneById(id: any){
        let data = await this.model.findById(id);
        return data;
    }
    
    async findOneByFields(fields: Object){
        let data = await this.model.find(fields);
        return data;
    }

    async create(entity: T){
       let data = await this.model.create(entity);
       return data;
    }

    async update(id: string, entity: T){
        const _id = new mongoose.Types.ObjectId(id);
        await this.model.findOneAndUpdate(_id, {$set : entity});
    }
    
    async delete(id: mongoose.Types.ObjectId){
        await this.model.findByIdAndDelete(id);
    }
    
}