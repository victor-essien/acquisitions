import logger from '../config/logger.js';
import bcrypt from 'bcrypt';
import { db } from '../config/database.js';
import { eq } from 'drizzle-orm';
import { users } from '../models/user.model.js';
import { cookies } from '../utils/cookies.js';

export const hashPassword = async password => {
  try {
    return await bcrypt.hash(password, 10);
  } catch (error) {
    logger.error('Error hashing password:', error);
    throw new Error('Error hashing password');
  }
};

export const comparePassword = async (plain, hash) => {
  try {
    return await bcrypt.compare(plain, hash);
  } catch (error) {
    logger.error('Error comparing password:', error);
    throw new Error('Error comparing password');
  }
};

export const signIn = async ({ email, password }) => {
  try {
    const userArr = await db
      .select()
      .from(users)
      .where(eq(users.email, email))
      .limit(1);
    if (userArr.length === 0) {
      throw new Error('Invalid email or password');
    }
    const user = userArr[0];
    const isMatch = await comparePassword(password, user.password);
    if (!isMatch) {
      throw new Error('Invalid email or password');
    }
    // Remove password before returning user object
    const { password: _pw, ...userSafe } = user;
    return userSafe;
  } catch (error) {
    logger.error('Error signing in:', error);
    throw new Error(error.message || 'Error signing in');
  }
};

// signOut implementation: clear cookie, log, send response
export const signOut = async (req, res, next) => {
  try {
    cookies.clear(res, 'token');
    logger.info('User signed out');
    return res.status(200).json({ message: 'User signed out' });
  } catch (error) {
    logger.error('Error in signout:', error);
    return res.status(500).json({ error: 'Error signing out' });
  }
};

export const createUser = async ({ name, email, password, role = 'user' }) => {
  try {
    const existingUser = await db
      .select()
      .from(users)
      .where(eq(users.email, email))
      .limit(1);

    if (existingUser.length > 0) {
      throw new Error('User with this email already exists');
    }
    const password_hash = await hashPassword(password);

    const [newUser] = await db
      .insert(users)
      .values({
        name,
        email,
        password: password_hash,
        role,
      })
      .returning({
        id: users.id,
        name: users.name,
        email: users.email,
        role: users.role,
        created_at: users.createdAt,
      });
    logger.info(`User ${newUser.email} created successfully`);
    return newUser;
  } catch (error) {
    logger.error('Error creating user:', error);
    throw new Error('Error creating user', error);
  }
};
