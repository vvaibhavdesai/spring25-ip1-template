import { Schema } from 'mongoose';

/**
 * Mongoose schema for the User collection.
 *
 * This schema defines the structure for storing users in the database.
 * Each User includes the following fields:
 * - `username`: The username of the user.
 * - `password`: The password securing the user's account.
 * - `dateJoined`: The date the user joined the platform.
 */
const userSchema = new Schema(

  // TODO: Task 1 - Define the schema for a user
  {
    username: { type: String, required: true, unique: true, trim: true },
    password: { type: String, required: true },
    dateJoined: { type: Date, default: Date.now },
  },
  {
    collection: 'User', // options go here
  }
);

export default userSchema;

