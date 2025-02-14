import express from 'express';
import mongoConnection from './databases/mongoDB';
import {FirebaseDb} from './databases/firebaseDB';
import config from 'config';

import T2 from './test/T2';

const app = express();
mongoConnection();
FirebaseDb.createConnection()
const PORT = config.get('PORT');
console.log('ENVIRONMENT', config.get("ENVIRONMENT"))
// T2().then(()=> {console.log("Executed Successfully")}).catch((error)=> {console.log(error)});

app.get('/', (req, res)=>{
    res.send("Server started");
})

app.listen(PORT, ()=>{
    console.log(`Server Started at Port ${PORT}`);
});