import express from 'express';
import { UsersController } from '../../controller/users.controller';
import { celebrate, Joi, Segments} from 'celebrate';
import { ChangePasswordSchema, validateRequestBody } from '../../schemas/UserValidation';

const router = express.Router();

router.get(
    '/all',
    UsersController.getAllUsers
);

router.get(
    '/id/:id',
    UsersController.getUserById
)

// router.get(
//     '/me',
//     UsersController.getUserByToken
// )

/**
 * @route POST users/checkUserPresent
 * @group users - Operations related to the user management
 * @param {string} email - user's email (must be a valid email format)
 */
router.post(
    '/checkUserPresent',
    celebrate({
      [Segments.BODY]: Joi.object().keys({
        email: Joi.string().email().required()
      })
    }),
    UsersController.checkUserPresent
);

/**
 * @route POST /users/create
 * @group Users - Operations related to user management
 * @param {string} name - User's name (min: 3, max: 30 characters)
 * @param {string} email - User's email (must be a valid email format)
 * @param {string} password - User's password (min: 8 characters, must contain at least one uppercase letter, one lowercase letter, one digit, and one special character)
 * @param {number} phoneNo - User's phone number (must be exactly 10 digits)
 * @param {number} role - User role (0 = Regular User, 1 = Admin)
 */
router.post(
    '/create',
    celebrate({
        [Segments.BODY]: Joi.object().keys({
           name: Joi.string().min(3).max(30).required(),
           email: Joi.string().email().required(),
           password: Joi.string().min(8).required().regex(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/),
           phoneNo: Joi.number().min(10).max(10).optional(),
           role: Joi.number().valid(0,1).required()
        })
    }),
    UsersController.createNewUser
)

/**
 * @route POST /users/login
 * @group users - Operations related to user mnagement
 * @param {string} email - User's email (must be a valid email format)
 * @param {string} password - User's password (must provide the password)
 */
router.post(
    '/login',
    celebrate({
        [Segments.BODY]: Joi.object().keys({
          email : Joi.string().required(),
          password : Joi.string().required()
        })
    }),
    UsersController.login
)

/**
 * @route UPDATE /users/update
 * @group users - Operations related to the user management
 * @param {string} updates.name - User's name (min: 3, max: 30 characters)
 * @param {string} updates.email - User's email (must be a valid email format)
 * @param {number} updates.phoneNo - User's phone number (10 digits)
 * @param {number} updates.role - User role (0 = Regular User, 1 = Admin)
 */
router.put(
    '/update',
    celebrate({
        [Segments.BODY]: Joi.object().keys({
            updates: Joi.object().keys({
                name: Joi.string().min(3).max(30).optional(),
                email: Joi.string().email().optional(),
                phoneNo: Joi.number().min(10).max(10).optional(),
                role: Joi.number().valid(0,1).optional(),
            }).min(1)
        })
    }),
    UsersController.updateUserDetails
)

/**
 * @route DELETE users/delete
 * @group users - Operations related to the user management
 * @param {string} email - User's email (must provide the correct email)
 */
router.delete(
    '/delete',
    celebrate({
        [Segments.BODY]: Joi.object().keys({
            email: Joi.string().email().required
        })
    }),
    UsersController.deleteUser
)

router.post(
    '/changePassword',
    validateRequestBody(ChangePasswordSchema),
  )

export default router;