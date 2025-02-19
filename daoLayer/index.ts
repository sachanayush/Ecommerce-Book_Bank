import config from "config";
import { IBook, Book } from "../models/book";
import { firebaseDao } from "./firebaseDao";
import { MongoDao } from "./mongoDao";

export class DaoFactory {
    static getDao() {
        if (config.get("DAO") === "MONGO") {
            return new MongoDao<IBook>(Book);
        } else if (config.get("DAO") === "firebase") {
            return new firebaseDao<IBook>("books");
        } else {
            throw new Error("Invalid DAO type in configuration");
        }
    }
}
