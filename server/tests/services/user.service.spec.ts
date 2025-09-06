import UserModel from '../../models/users.model';
import {
  deleteUserByUsername,
  getUserByUsername,
  loginUser,
  saveUser,
  updateUser,
} from '../../services/user.service';
import { SafeUser, User, UserCredentials } from '../../types/user';
import { user, safeUser } from '../mockData.models';

// eslint-disable-next-line @typescript-eslint/no-var-requires
const mockingoose = require('mockingoose');

describe('User model', () => {
  beforeEach(() => {
    mockingoose.resetAll();
  });

  describe('saveUser', () => {
    beforeEach(() => {
      mockingoose.resetAll();
    });

    it('should return the saved user', async () => {
      mockingoose(UserModel).toReturn(user, 'create');
      const savedUser = (await saveUser(user)) as SafeUser;
      expect(savedUser._id).toBeDefined();
      expect(savedUser.username).toEqual(user.username);
      expect(savedUser.dateJoined).toEqual(user.dateJoined);
    });

    it('should return error if username already exists', async () => {
      mockingoose(UserModel).toReturn({ code: 11000 }, 'save');
      const result = await saveUser(user);
      expect(result).toHaveProperty('error', 'Username already exists');
    });

    it('should return error if username is missing', async () => {
      const invalidUser = { password: 'securepassword123', dateJoined: new Date() } as Partial<User>;
      // Cast to User but expect error
      const result = await saveUser(invalidUser as User);
      expect(result).toHaveProperty('error');
    });

    it('should return error if password is missing', async () => {
      const invalidUser = { username: 'alex.smith', dateJoined: new Date() } as Partial<User>;
      const result = await saveUser(invalidUser as User);
      expect(result).toHaveProperty('error');
    });
  });
});

describe('getUserByUsername', () => {
  beforeEach(() => {
    mockingoose.resetAll();
  });

  it('should return the matching user', async () => {
    mockingoose(UserModel).toReturn(safeUser, 'findOne');

    const retrievedUser = (await getUserByUsername(user.username)) as SafeUser;

    expect(retrievedUser.username).toEqual(user.username);
    expect(retrievedUser.dateJoined).toEqual(user.dateJoined);
  });

  it('should return error if user does not exist', async () => {
    mockingoose(UserModel).toReturn(null, 'findOne');

    const result = await getUserByUsername('nonexistentuser');
    expect(result).toHaveProperty('error', 'User not found');
  });

  it('should handle database errors gracefully', async () => {
    mockingoose(UserModel).toReturn(new Error('Error finding document'), 'findOne');

    const getUserError = await getUserByUsername(user.username);

    expect('error' in getUserError).toBe(true);
  });
});

describe('loginUser', () => {
  beforeEach(() => {
    mockingoose.resetAll();
  });

  it('should return the user if authentication succeeds', async () => {
    mockingoose(UserModel).toReturn({ ...user }, 'findOne');

    const credentials: UserCredentials = {
      username: user.username,
      password: user.password,
    };

    const loggedInUser = (await loginUser(credentials)) as SafeUser;

    expect(loggedInUser.username).toEqual(user.username);
    expect(loggedInUser.dateJoined).toEqual(user.dateJoined);
  });

  it('should return error if user does not exist', async () => {
    mockingoose(UserModel).toReturn(null, 'findOne');

    const credentials: UserCredentials = {
      username: 'nonexistentuser',
      password: 'anyPassword',
    };

    const result = await loginUser(credentials);
    expect(result).toHaveProperty('error', 'Invalid username or password');
  });

  it('should return error if password does not match', async () => {
    mockingoose(UserModel).toReturn({ ...user, password: 'differentPassword' }, 'findOne');

    const credentials: UserCredentials = {
      username: user.username,
      password: 'wrongPassword',
    };

    const result = await loginUser(credentials);
    expect(result).toHaveProperty('error', 'Invalid username or password');
  });
});

describe('deleteUserByUsername', () => {
  beforeEach(() => {
    mockingoose.resetAll();
  });

  it('should return the deleted user when deleted succesfully', async () => {
    mockingoose(UserModel).toReturn(safeUser, 'findOneAndDelete');

    const deletedUser = (await deleteUserByUsername(user.username)) as SafeUser;

    expect(deletedUser.username).toEqual(user.username);
    expect(deletedUser.dateJoined).toEqual(user.dateJoined);
  });

  // TODO: Task 1 - Write additional test cases for deleteUserByUsername
});

describe('updateUser', () => {
  const updatedUser: User = {
    ...user,
    password: 'newPassword',
  };

  const safeUpdatedUser: SafeUser = {
    username: user.username,
    dateJoined: user.dateJoined,
  };

  const updates: Partial<User> = {
    password: 'newPassword',
  };

  beforeEach(() => {
    mockingoose.resetAll();
  });

  it('should return the updated user when updated succesfully', async () => {
    mockingoose(UserModel).toReturn(safeUpdatedUser, 'findOneAndUpdate');

    const result = (await updateUser(user.username, updates)) as SafeUser;

    expect(result.username).toEqual(user.username);
    expect(result.username).toEqual(updatedUser.username);
    expect(result.dateJoined).toEqual(user.dateJoined);
    expect(result.dateJoined).toEqual(updatedUser.dateJoined);
  });

  // TODO: Task 1 - Write additional test cases for updateUser

    it('should throw an error if the username is not found', async () => {
    mockingoose(UserModel).toReturn(null, 'findOneAndUpdate');

    const result = await updateUser(user.username, updates);

    expect(result).toHaveProperty('error', 'User not found');
  });


  it('should throw an error if a database error occurs', async () => {
    mockingoose(UserModel).toReturn(new Error('Error updating object'), 'findOneAndUpdate');

    const result = await updateUser(user.username, updates);

    expect(result).toHaveProperty('error');
    expect('error' in result).toBe(true);
  });

  it('should update the biography if the user is found', async () => {
    const newBio = 'biography updating in no time';
    const biographyUpdates: Partial<User> = { biography: newBio };

    mockingoose(UserModel).toReturn({ ...safeUpdatedUser, biography: newBio }, 'findOneAndUpdate');

    const result = await updateUser(user.username, biographyUpdates);

    expect('username' in result).toBe(true);
    if ('username' in result) {
      expect(result.biography).toEqual(newBio);
    }
  });

  it('should return an error if biography update fails because user not found', async () => {
    mockingoose(UserModel).toReturn(null, 'findOneAndUpdate');

    const newBio = 'No user found test';
    const biographyUpdates: Partial<User> = { biography: newBio };
    const result = await updateUser(user.username, biographyUpdates);

    expect(result).toHaveProperty('error', 'User not found');
  });

});
