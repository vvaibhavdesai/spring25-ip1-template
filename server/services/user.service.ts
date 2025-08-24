import UserModel from '../models/users.model';
import { User, UserCredentials, UserResponse } from '../types/types';

/**
 * Saves a new user to the database.
 *
 * @param {User} user - The user object to be saved, containing user details like username, password, etc.
 * @returns {Promise<UserResponse>} - Resolves with the saved user object (without the password) or an error message.
 */
export const saveUser = async (user: User): Promise<UserResponse> => {
  try {
    // Create a new user document
    const newUser = new UserModel({
      username: user.username,
      password: user.password,
      dateJoined: user.dateJoined || new Date(),
    });

    // Save to database
    const savedUser = await newUser.save();

    // Return SafeUser (without password)
    const { _id, username, dateJoined } = savedUser;
    return { _id, username, dateJoined };
  } catch (err: any) {
    if (err.code === 11000) {
      return { error: 'Username already exists' };
    }
    return { error: err.message || 'Failed to create user' };
  }
};

/**
 * Retrieves a user from the database by their username.
 *
 * @param {string} username - The username of the user to find.
 * @returns {Promise<UserResponse>} - Resolves with the found user object (without the password) or an error message.
 */
export const getUserByUsername = async (username: string): Promise<UserResponse> => {
  try {
    //lean is used to make the query faster it return POJO and not Mongoose document 
    // note: so the user Obj will not have any getters/setters those are present on mongoose obj
    const user = await UserModel.findOne({ username }).lean();
    if (!user) {
      return { error: 'User not found' };
    }
    // Exclude password from result
    const { _id, dateJoined } = user;
    return { _id, username, dateJoined };
  } catch (err: any) {
    return { error: err.message || 'Failed to retrieve user' };
  }
};

/**
 * Authenticates a user by verifying their username and password.
 *
 * @param {UserCredentials} loginCredentials - An object containing the username and password.
 * @returns {Promise<UserResponse>} - Resolves with the authenticated user object (without the password) or an error message.
 */
export const loginUser = async (loginCredentials: UserCredentials): Promise<UserResponse> => {
  try {
    const user = await UserModel.findOne({ username: loginCredentials.username }).lean();
    if (!user) {
      return { error: 'Invalid username or password' };
    }
    if (user.password !== loginCredentials.password) {
      return { error: 'Invalid username or password' };
    }
    // Exclude password from result
    const { _id, username, dateJoined } = user;
    return { _id, username, dateJoined };
  } catch (err: any) {
    return { error: err.message || 'Failed to authenticate user' };
  }
};

/**
 * Deletes a user from the database by their username.
 *
 * @param {string} username - The username of the user to delete.
 * @returns {Promise<UserResponse>} - Resolves with the deleted user object (without the password) or an error message.
 */
export const deleteUserByUsername = async (username: string): Promise<UserResponse> =>
  // TODO: Task 1 - Implement the deleteUserByUsername function. Refer to other service files for guidance.
  ({ error: 'Not implemented' });

/**
 * Updates user information in the database.
 *
 * @param {string} username - The username of the user to update.
 * @param {Partial<User>} updates - An object containing the fields to update and their new values.
 * @returns {Promise<UserResponse>} - Resolves with the updated user object (without the password) or an error message.
 */
export const updateUser = async (username: string, updates: Partial<User>): Promise<UserResponse> =>
  // TODO: Task 1 - Implement the updateUser function. Refer to other service files for guidance.
  ({ error: 'Not implemented' });
