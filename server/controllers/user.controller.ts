import express, { Response, Router } from 'express';
import { UserRequest, User, UserCredentials, UserByUsernameRequest } from '../types/types';
import {
  deleteUserByUsername,
  getUserByUsername,
  loginUser,
  saveUser,
  updateUser,
} from '../services/user.service';

const userController = () => {
  const router: Router = express.Router();

  /**
   * Validates that the request body contains all required fields for a user.
   * @param req The incoming request containing user data.
   * @returns `true` if the body contains valid user fields; otherwise, `false`.
   */
  
  const isUserBodyValid = (req: UserRequest): boolean => {
    const { username, password } = req.body;
    return typeof username === 'string' && username.trim() !== '' &&
          typeof password === 'string' && password.trim() !== '';
  };


  /**
   * Handles the creation of a new user account.
   * @param req The request containing username, email, and password in the body.
   * @param res The response, either returning the created user or an error.
   * @returns A promise resolving to void.
   */
  const createUser = async (req: UserRequest, res: Response): Promise<void> => {
    if (!isUserBodyValid(req)) {
      res.status(400).json({ error: 'Invalid request body: username and password are required.' });
      return;
    }

    const { username, password } = req.body;
    const result = await saveUser({ username, password, dateJoined: new Date() });

    if ('error' in result) {
      res.status(400).json(result);
    } else {
      res.status(201).json(result);
    }
  };
  /**
   * Handles user login by validating credentials.
   * @param req The request containing username and password in the body.
   * @param res The response, either returning the user or an error.
   * @returns A promise resolving to void.
   */
  const userLogin = async (req: UserRequest, res: Response): Promise<void> => {
    if (!isUserBodyValid(req)) {
      res.status(400).json({ error: 'Invalid request body: username and password are required.' });
      return;
    }

    const { username, password } = req.body;
    const result = await loginUser({ username, password });

    if ('error' in result) {
      res.status(401).json(result);
    } else {
      res.status(200).json(result);
    }
  };

  /**
   * Retrieves a user by their username.
   * @param req The request containing the username as a route parameter.
   * @param res The response, either returning the user or an error.
   * @returns A promise resolving to void.
   */
  const getUser = async (req: UserByUsernameRequest, res: Response): Promise<void> => {
      const { username } = req.params;
      if (!username || typeof username !== 'string' || username.trim() === '') {
        res.status(400).json({ error: 'Invalid or missing username parameter.' });
        return;
      }

      const result = await getUserByUsername(username);

      if ('error' in result) {
        res.status(404).json(result);
      } else {
        res.status(200).json(result);
      }
    };

  /**
   * Deletes a user by their username.
   * @param req The request containing the username as a route parameter.
   * @param res The response, either the successfully deleted user object or returning an error.
   * @returns A promise resolving to void.
   */
  const deleteUser = async (req: UserByUsernameRequest, res: Response): Promise<void> => {
    // TODO: Task 1 - Implement the deleteUser function
    res.status(501).send('Not implemented');
  };

  /**
   * Resets a user's password.
   * @param req The request containing the username and new password in the body.
   * @param res The response, either the successfully updated user object or returning an error.
   * @returns A promise resolving to void.
   */
  const resetPassword = async (req: UserRequest, res: Response): Promise<void> => {
    const { username, password } = req.body;
    if (!isUserBodyValid(req)) {
      res.status(400).json({ error: 'Invalid request body: username and password are required.' });
      return;
    }
    // TODO[Vaibhav] - Weak password improvisation

    const result = await updateUser(username, password);

    if ('error' in result) {
      res.status(400).json(result);
    } else {
      res.status(200).json(result);
    }
  };

  // Define routes for the user-related operations.
  // TODO: Task 1 - Add appropriate HTTP verbs and endpoints to the router

  return router;
};

export default userController;
