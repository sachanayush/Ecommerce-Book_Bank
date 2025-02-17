import mongoose from "mongoose";
import config from "config"

const mongoConnection = async () => {
   const { host, port, dbName } = config.get<{ host: string, port: string, dbName: string }>('dbConfig');
   try {
      const conn = await mongoose.connect(`${host}:${port}/${dbName}`);
      console.log("MongoDB database is connected");
   } catch (err: any) {
      console.log(err);
   }
}

export default mongoConnection;