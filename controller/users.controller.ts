import config from "config";
import { DaoFactory } from "../daoLayer";
import * as bcrypt from "bcrypt";
import { createJwtToken } from "../utils/helpers";
import { ISession, IUser, User } from "../models/user";
import { sessionManager } from "../utils/sessionManager";
import { aes } from "../utils/aes";

const usersDao = DaoFactory.getDao<IUser>(User);

export const UsersController = {

/**
* @route POST /users/create
* @group Users - Operations related to user management
* @param name - User's name (min: 3, max: 50 characters)
* @param email - User's email (must be a valid email format)
* @param password - User's password (min: 8 characters)
* @param phoneNo - User's phone number (10 digits)
* @param role - User role (default: 2 for regular user)
* @returns {object} 201 - Successfully created user
* @returns {Error} 400 - User already exists with this email
* @returns {Error} 500 - Internal Server Error
*/
    createNewUser: async (req: any, res: any) => {
        try {
            const { name, email, password, phoneNo, role } = req.body;
            const existingUser = await usersDao.findOneByFields({ email });
            if (existingUser) {
                return res.status(400).json({ error: "User already exists with this email." });
            }

            const encryptedPassword = await bcrypt.hash(password, 10);

            const newUser: IUser = new User({
                name,
                email,
                password: encryptedPassword,
                phoneNo,
                role: role || 2,
                createdOn: new Date(),
                updatedOn: new Date(),
            });

            await usersDao.create(newUser);

            res.status(201).json({
                message: "User created successfully"
            });

        } catch (error) {
            console.error("Error creating user:", error);
            res.status(500).json({ error: "Internal Server Error" });
        }
    },

/**
* @route GET /users/id/:id
* @group Users - Operations related to user management
* @param id - User ID
* @returns {object} 200 - User data retrieved successfully
* @returns {Error} 500 - Internal Server Error
*/
    getUserById: async (req: any, res: any) => {
        try {
            const { id } = req.params;
            const data = await usersDao.findOneById(id);
            return res.status(200).send({ result: data });
        } catch (err: any) {
            return res.status(500).send({ message: err });
        }
    },

/**
* @route GET /users/all
* @group Users - Operations related to user management
* @returns {object} 200 - List of all users
* @returns {Error} 500 - Internal Server Error
*/
    getAllUsers: async (req: any, res: any) => {
        try {
            const data = await usersDao.getAll();
            return res.status(200).send({ result: data });
        } catch (err: any) {
            return res.status(500).send({ message: err });
        }
    },

/**
* @route GET /users/me
* @group Users - Operations related to user management
* @headers  Authorization - User authentication token
* @returns {object} 200 - User data retrieved successfully
* @returns {Error} 500 - Internal Server Error
*/
    getUserByToken: async (req: any, res: any) => {
        try {
            const tokenHeaderKey = config.get<string>('TOKEN_HEADER_KEY');
            
            const token = req.headers[tokenHeaderKey];
            /**
             * Get the token data from the token
             */
            let tokenData = (await sessionManager.verifyJwtToken(token)) as IUser;
            const data = await usersDao.findOneByFields({ email: tokenData.email });
            return res.status(200).send({ result: data })
        } catch (err: any) {
            return res.status(500).send({ message: err });
        }
    },

/**
* @route POST /users/checkUserPresent
* @group Users - Operations related to user management
* @param email - User's email
* @returns {object} 200 - Boolean result indicating if the user exists
* @returns {Error} 500 - Internal Server Error
*/
    checkUserPresent: async (req: any, res: any) => {
        try {
            let user: IUser | null = await usersDao.findOneByFields({ email: req.body.email });
            if (user) {
              res.status(200).json({ result: true });
            } else {
             return res.status(200).json({ result: false });
            }
          } catch (err: any) {
            return res.status(500).send({err });
          }
    },

/**
* @route POST /users/login
* @group Users - User authentication
* @param email - User's email
* @param password - User's password
* @returns {object} 200 - Login successful, returns encrypted access token
* @returns {Error} 401 - Invalid email or password
* @returns {Error} 500 - Internal Server Error
*/
    login: async (req: any, res: any) => {
        try {
            const { email, password } = req.body;
            /**
             * 
             */
            let ipAddress = req.socket.remoteAddress;
            if (ipAddress === "::1") ipAddress = "127.0.0.1";

            const user = (await usersDao.findOneByFields({ email })) as IUser | null;
            if (!user) {
                return res.status(404).json({ error: "User not found." });
            }

            const isPasswordValid = await bcrypt.compare(password, user.password);
            if (!isPasswordValid) {
                return res.status(401).json({ error: "Invalid email or password." });
            }

            const accessToken = createJwtToken({ id: user._id, email: user.email });

            const createdAt = Date.now();
            const expiresAt = createdAt + parseInt(config.get("ACCESS_TOKEN_EXPIRY_TIME"), 10) * 60 * 60 * 1000;

            const newSession: ISession = {
                accessToken,
                ipAddress,
                createdAt,
                expiresAt,
            };

            const existingSession = user.sessions.find(session => session.ipAddress === ipAddress);
            const maxSessions: number = parseInt(config.get('MAXIMUM_ACTIVE_SESSION'));

            if (!existingSession && user.sessions.length >= maxSessions) {
                return res.status(409).json({ error: `You cannot log in on more than ${maxSessions} devices simultaneously.` });
            }

            if (existingSession) {
                await usersDao.update(
                    user._id,
                    {
                        $set: {
                            "sessions.$[elem].accessToken": accessToken,
                            "sessions.$[elem].createdAt": createdAt,
                            "sessions.$[elem].expiresAt": expiresAt,
                        },
                    },
                    {
                        arrayFilters: [{ "elem.idAddress": ipAddress }],
                        new: true
                    }
                );
            } else {
                await usersDao.update(user._id, {
                    $push: { sessions: newSession }
                });
            }

            const encryptedAccessToken = await aes.encrypt(accessToken);
            return res.status(200).json({
                message: "Login successful",
                encryptedAccessToken,
            });

        } catch (error) {
            console.error("Error during login:", error);
            return res.status(500).json({ error: "Internal Server Error" });
        }
    },

/**
* @route PUT /users/update/:userId
* @group Users - Operations related to user management
* @param userId.path.required - User ID
* @param name.body.optional - User's name (min: 3, max: 50 characters)
* @param email.body.optional - User's email (must be a valid email format)
* @param phoneNo.body.optional - User's phone number (10 digits)
* @param role.body.optional - User role (0 = Regular User, 1 = Admin)
* @returns {object} 200 - Successfully updated user details
* @returns {Error} 404 - User not found
* @returns {Error} 500 - Internal Server Error
*/
    updateUserDetails: async (req: any, res: any) => {
        try {
            const userId = req.params.userId;
    
            const { name, email, phoneNo, role } = req.body;

            const updatedUser = await User.findByIdAndUpdate(
                userId,
                {
                    $set: {
                        ...(name && { name }),
                        ...(email && { email }),
                        ...(phoneNo && { phoneNo }),
                        ...(role && { role }),
                        updatedOn: new Date(),
                    },
                },
                { new: true, runValidators: true }
            );
    
            if (!updatedUser) {
                return res.status(404).json({ error: "User not found" });
            }
    
            return res.status(200).json({
                message: "User details updated successfully",
                user: updatedUser,
            });
        } catch (error) {
            console.error("Error updating user details:", error);
            return res.status(500).json({ error: "Internal Server Error" });
        }
    },

/**
* @route DELETE /users/delete
* @group Users - Operations related to user management
* @param email.body.required - User's email
* @returns {object} 200 - User deleted successfully
* @returns {Error} 404 - User not found
* @returns {Error} 500 - Internal Server Error
*/
    deleteUser: async (req: any, res: any) => {
        try {
            let email = req.body.email;
            let deletedUser = await usersDao.delete({email : email})
            if (deletedUser) {
              res.status(200).send("User deleted successfully!");
            } else {
              return res.status(404).send("User not found!");
            }
          } catch (err:any) {
            return res.status(500).send({ err });
          }
    }
}