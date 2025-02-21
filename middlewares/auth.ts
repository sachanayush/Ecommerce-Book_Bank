import auth from 'basic-auth'
import config from 'config'
import { aes } from '../utils/aes';
import { sessionManager } from '../utils/sessionManager';

/**
 * @class Auth
 * @description Provides authentication methods including Basic Authentication, JWT validation, and token decryption.
 */
export class Auth {

    /**
     * @description Validates username and password against stored credentials.
     * @param {string} name - Username input.
     * @param {string} pass - Password input.
     * @returns {boolean} - Returns true if credentials match, otherwise false.
     */
    static check(name: string, pass: string): boolean{
        if(name === config.get('userName') && pass === config.get('password')){
             return true;
        }
        return false;
    }

    /**
     * @description Middleware for handling basic authentication.
     * @param {any} req - Express request object.
     * @param {any} res - Express response object.
     * @param {Function} next - Callback to proceed to the next middleware.
     */
    static async basicAuth(req: any, res: any, next: () => void){
         const credentials = auth(req);
         /**
          * Check if credentials match stored values
          */
         if(credentials && Auth.check(credentials.name, credentials.pass)){
            next();
         }
         else{
            res.status(401).json({message: "Unauthorized Access"});
         }
    }

    /**
     * @description Middleware for validating access tokens.
     * @param {any} req - Express request object.
     * @param {any} res - Express response object.
     * @param {Function} next - Callback to proceed to the next middleware.
     */
    static async validateAccessToken(req: any, res: any, next: () => void){
        const tokenHeaderKey = config.get('TOKEN_HEADER_KEY');
        try{
            /**
             * Extract token from header
             */
             const token = req.header(tokenHeaderKey);
             const tokenData = await sessionManager.verifyJwtToken(token);

             /**
              * Check token expiry and refresh if necessary
              */
             const result: any = await sessionManager.checkTokenExpiry(token);
             
             if (!result.isValid && !result.refreshToken) {
                return res.status(400).json({error: "Unauthorized"});
            }

             req.tokenData = tokenData;
             next();

        }catch(error: any){
           res.status(401).json(error);
        }
    }
 
    /**
     * @description Middleware for decrypting encrypted access tokens.
     * @param {any} req - Express request object.
     * @param {any} res - Express response object.
     * @param {Function} next - Callback to proceed to the next middleware.
     */

    static async decryptAccessToken(req: any, res: any, next: () => void) { 
        if(config.get('AUTH_VERSION') === 'v1') return next();

        try {
            const tokenHeaderKey = config.get<string>('TOKEN_HEADER_KEY');
            const encryptedToken = req.headers[tokenHeaderKey];
            
            if (!encryptedToken) {
                return res.status(401).json({ message: "Unauthorized Access: No token provided" });
            }
    /**
     * Decrypt the token
     */
            const decryptedToken = await aes.decrypt(encryptedToken);
            if (!decryptedToken) {
                return res.status(401).json({ message: "Unauthorized Access: Invalid token" });
            }
    /**
     * Replace the encrypted token with the decrypted version
     */
            req.headers[tokenHeaderKey] = decryptedToken;

            next();
    
        } catch (error) {
            res.status(500).json({ message: "Server error during decryption" });
        }
    }
}
