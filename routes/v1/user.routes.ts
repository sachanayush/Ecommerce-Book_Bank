import express from 'express';
import { UsersController } from '../../controller/users.controller';
import { validateRequestBody } from '../../schemas';
import { ChangePasswordSchema, CheckUserPresentSchema, CreateUserSchema, DeleteUserSchema, LoginSchema, UpdateUserDetailsSchema} from '../../schemas/userSchema';
import { Auth } from '../../middlewares/auth';

const router = express.Router();
//Test
    router.get('/test', Auth.validateAccessToken, 
        async function test(req: any, res) {
            res.status(200).json("Basic Auth working");
        }
    )

/**
 * @route GET /books/all
 * @group books - Operations related to book management
 * @description Retrieve all books from the database
 */
router.get(
    '/all',
    // Auth.basicAuth,
    UsersController.getAllUsers
);

/**
 * @route GET /books/id/{id}
 * @group books - Operations related to book management
 * @param {string} id - Book ID (must be a valid ObjectId)
 * @description Retrieve a book by its ID
 */
router.get(
    '/id/:id',
    // Auth.basicAuth,
    UsersController.getUserById
);

/**
 * @route GET /books/me
 * @group books - Operations related to book management
 * @description Retrieve books associated with the currently authenticated user
 */
router.get(
    '/getUserByToken',
    Auth.decryptAccessToken,
    // Auth.basicAuth,
    // Auth.validateAccessToken,
    UsersController.getUserByToken
);

/**
 * @route POST users/checkUserPresent
 * @group users - Operations related to the user management
 * @param {string} email - user's email (must be a valid email format)
 */
router.post(
    '/checkUserPresent',
    // Auth.basicAuth,
    validateRequestBody(CheckUserPresentSchema),
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
    // Auth.basicAuth,
    // validateRequestBody(CreateUserSchema),
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
    // Auth.basicAuth,
    // validateRequestBody(LoginSchema),
    UsersController.login
);

/**
 * @route UPDATE /users/update
 * @group users - Operations related to the user management
 * @param {string} updates.name - User's name (min: 3, max: 30 characters)
 * @param {string} updates.email - User's email (must be a valid email format)
 * @param {number} updates.phoneNo - User's phone number (10 digits)
 * @param {number} updates.role - User role (0 = Regular User, 1 = Admin)
 */
router.put(
    '/update/:userId',
    // Auth.basicAuth,
    // Auth.validateAccessToken,
    // validateRequestBody(UpdateUserDetailsSchema),
    UsersController.updateUserDetails
);

/**
 * @route DELETE users/delete
 * @group users - Operations related to the user management
 * @param {string} email - User's email (must provide the correct email)
 */
router.delete(
    '/delete',
    // Auth.basicAuth,
     validateRequestBody(DeleteUserSchema),
    UsersController.deleteUser
)

/**
 * @route POST users/changePassword
 * @group users - Operations related to the user management
 * @param {string} email - User's email (must provide the email)
 * @param {string} oldPassword - User's old password
 * @param {string} newPassword - User's new password
 * @param {string} confirmNewPassword - User's new password
 */
router.post(
    '/changePassword',
    Auth.basicAuth,
    validateRequestBody(ChangePasswordSchema),
  )

export default router;