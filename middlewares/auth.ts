import auth from 'basic-auth'
import config from 'config'
import { verifyJwtToken } from '../utils/helpers';

export class Auth {

    static check(name: string, pass: string): boolean{
        if(name === config.get('userName') && pass === config.get('password')){
             return true;
        }
        return false;
    }

    static async basicAuth(req: any, res: any, next: () => void){
         const credentials = auth(req);
         if(credentials && Auth.check(credentials.name, credentials.pass)){
            next();
         }
         else{
            res.status(401).json({message: "Unauthorized Access"});
         }
    }

    static async userAuth(req: any, res: any, next: () => void){
        const tokenHeaderKey = config.get('TOKEN_HEADER_KEY');
        try{
             const token = req.header(tokenHeaderKey);
             const tokenData = verifyJwtToken(token).catch((error: any) => {
                console.log("Error while verifying user auth token", error);
                throw error;
             });

             if (!tokenData) {
                return res.status(401).json({ message: "Unauthorized Access: Invalid token" });
            }
             
             req.tokenData = tokenData;
             next();

        }catch(error){
            res.status(401).json(({message: "Unauthorized Access"}));
        }
    }
}