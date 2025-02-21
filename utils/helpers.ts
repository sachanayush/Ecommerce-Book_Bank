import { CONSTANT_VALUE } from "../constants/constants";
import { sign, verify } from "jsonwebtoken";
import config from 'config';
import { aes } from "./aes";

/**
 * @param limit - The number of records per page (optional).
 * @param page - The current page number (optional).
 * @returns {Promise<{ limit: number; offset: number }>} - Returns an object containing the `limit` and `offset` values.
 */
export const getLimitOffest = async (limit?: number, page?: number): Promise<{ limit: number; offset: number }> => {
    try {
        if (limit) {
            limit = Math.abs(limit);
        } else {
            limit = CONSTANT_VALUE.MIN_LIMIT;
        }

        if (page && page != 0) {
            page = Math.abs(page);
        } else {
            page = CONSTANT_VALUE.PAGE;
        }
/**
 * Calculate offset based on the page number and limit
 */
        let offset: number = (page - 1) * limit;
        offset = offset < 0 ? 0 : offset;

        return { limit, offset };

    } catch (error: any) {
        /**
         * Return default values in case of error
         */
        return { limit: CONSTANT_VALUE.MIN_LIMIT, offset: 0 };
    }
}

/**
 * @description Generates a JSON Web Token (JWT) using a secret key.
 * @param {object} payload - The payload data to encode in the JWT.
 * @returns {string} - The generated JWT token.
 */
export const createJwtToken = (payload: object) => {
    return sign(payload, <string>config.get('JWT_SECRET_KEY'));
}

/**
 * @description Encrypts a given string using AES encryption.
 * @param {string} payload - The string to be encrypted.
 * @returns {Promise<string>} - The encrypted string.
 */
export const aesEncryption = async (payload: string) => {
        return aes.encrypt(payload);  
}
