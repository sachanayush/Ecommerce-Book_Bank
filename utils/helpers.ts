import { CONSTANT_VALUE } from "../constants/constants";
import { sign, verify } from "jsonwebtoken";
import config from 'config'

/**
 * @param limit - The number of records per page (optional).
 * @param page - The current page number (optional).
 * @returns {Promise<{ limit: number; offset: number }>} - Returns an object containing the `limit` and `offset` values.
 */
export const getLimitOffest = async(limit?: number, page?: number): Promise<{ limit: number; offset: number }> => {
    try{
        if(limit){
            limit = Math.abs(limit);
        }else{
            limit = CONSTANT_VALUE.MIN_LIMIT;
        }

        if(page && page != 0){
            page = Math.abs(page);
        }else{
            page = CONSTANT_VALUE.PAGE;
        }

        let offset: number = (page -1)*limit;
        offset = offset < 0 ? 0 : offset;

        return {limit, offset};

    }catch(error: any){
        console.log(error);
        return { limit: CONSTANT_VALUE.MIN_LIMIT, offset: 0 };
    }
}

export const createJwtToken = async(payload: object, expiryTime?: number) => {
    if (expiryTime) return await sign(payload, <string>config.get('JWT_SECRET_KEY'), { expiresIn: expiryTime });

     return await sign(payload, config.get('JWT_SECRET_KEY'));
}

export const verifyJwtToken = async(payload: string) => {
    try{
        return verify(payload, config.get('JWT_SECRET_KEY'));
    }catch(error){
        console.log(error);
    }
}