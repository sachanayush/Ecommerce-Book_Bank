import { FirebaseApp } from "firebase/app";
import { getDatabase, ref, set, get, update, remove, child, DatabaseReference, push} from "firebase/database";
import {FirebaseDb} from "../databases/firebaseDB";

export class firebaseDao<T>{
    private ref: DatabaseReference;

    constructor(dbName : string){
        const db = getDatabase(FirebaseDb.getApp())
        this.ref = ref(db, `${dbName}/`);
    }
    
    getref(): DatabaseReference {
        return this.ref;
    }

    async getAll(): Promise<T[]> {
        const data = await get(this.ref);
        if (!data.exists()) return [];
        return data.val();
    }

    async findOneById(id: string): Promise<T | null> {
        const recordRef = child(this.ref, id);
        const data = await get(recordRef);
        if (!data.exists()) return null;
        return data.val();
    }

    async findOneByFields(fields: Partial<T>): Promise<T[]> {
        const allData = await this.getAll();
        const dataArray = Array.isArray(allData) ? allData : Object.values(allData) as T[];
      
        return dataArray.filter((item) =>
          Object.entries(fields).every(([key, value]) => item[key as keyof T] === value)
        );
      }    

      async create(entity: T): Promise<{ id: string; data: T }> {
        const recordRef = push(this.ref); 
        const id = recordRef.key; 
        if (!id) throw new Error("Failed to generate a unique ID");
      
        await set(recordRef, entity); 
        return { id, data: entity }; 
      }

      async update(id: string, updatedFields: Partial<T>): Promise<void> {
        const recordRef = child(this.ref, id);
        await update(recordRef, updatedFields);
      }
    
      async delete(id: string): Promise<void> {
        const recordRef = child(this.ref, id);
        await remove(recordRef);
      }

}