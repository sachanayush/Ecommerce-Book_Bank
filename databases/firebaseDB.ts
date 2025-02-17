import { FirebaseApp, initializeApp, getApps, getApp } from "firebase/app";
import { Database, getDatabase } from "firebase/database";
import config from "config";

export class FirebaseDb {
    private static app : FirebaseApp;
    private static database : Database;

    static getApp() {
        try {
            const firebaseConfig = {
                databaseURL: config.get<string>('firebaseURL')
            };

            this.app = initializeApp(firebaseConfig);
            this.database = getDatabase(this.app)
            console.log("Connected with Firebase")
            return this.app;
        } catch (error: any) {
            console.log(error.message);
        }
    }

    // static getApp(): FirebaseApp {
    //     try {
    //         const firebaseConfig = {
    //             databaseURL: config.get<string>('firebaseURL')
    //         };

    //     if (!this.app) {
    //       if (getApps().length === 0) {
    //         this.app = initializeApp(firebaseConfig);
    //       } else {
    //         this.app = getApp(); 
    //       }
    //     }
    // }catch(err){
    //     console.log(err);
    // }
    //     return this.app;
    //   }

    // static getApp(){
    //     return this.app
    // }

    static getDb(){
        return this.database
    }
} 