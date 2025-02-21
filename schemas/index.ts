import { Request, Response, NextFunction } from 'express';
import { ObjectSchema } from 'joi'

/**
 * 
 * @param {ObjectSchema} schema - Joi schema to validate the request body.
 * @returns {(req: Request, res: Response, next: NextFunction) => void} - Middleware function.
 */
export const validateRequestBody = (schema: ObjectSchema) => {
    return (req: Request, res: Response, next: NextFunction): void => {
        const {error} = schema.validate(req.body);

        if (error) {
            res.status(400).json({
              success: false,
              errors: error.details.map((err) => err.message),
            });
            return; 
          }
          next();
    }
}
