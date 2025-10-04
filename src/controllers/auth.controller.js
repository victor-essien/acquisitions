import logger from '../config/logger.js';
import { createUser } from '../services/auth.service.js';
import { cookies } from '../utils/cookies.js';
import { formatValidationError } from '../utils/format.js';
import { jwttoken } from '../utils/jwt.js';
import { signUpSchema } from '../validations/auth.validation.js';

import { signIn } from '../services/auth.service.js';
import { z } from 'zod';

export const signup = async (req, res, next) => {
  try {
    const validationResult = signUpSchema.safeParse(req.body);

    if (!validationResult.success) {
      return res.status(400).json({
        error: 'Validation failed',
        details: formatValidationError(validationResult.error),
      });
    }

    const { name, email, password, role } = validationResult.data;

    // AUTH SERVICE
    const user = await createUser({ name, email, password, role });

    const token = jwttoken.sign({
      id: user.id,
      email: user.email,
      role: user.role,
    });

    cookies.set(res, 'token', token);
    logger.info(`User registered successfully: ${email}`);
    return res.status(201).json({
      message: 'User registered ',
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        role: user.role,
      },
    });
  } catch (error) {
    logger.error('Error in signup :', error);
    if (error.message === 'User with this email already exists') {
      return res.status(409).json({ error: 'Email already exist' });
    }
    next(error);
  }
};


const signInSchema = z.object({
  email: z.string().email(),
  password: z.string().min(6),
});

export const signin = async (req, res, next) => {
  try {
    const validationResult = signInSchema.safeParse(req.body);
    if (!validationResult.success) {
      return res.status(400).json({
        error: 'Validation failed',
        details: formatValidationError(validationResult.error),
      });
    }
    const { email, password } = validationResult.data;
    const user = await signIn({ email, password });
    const token = jwttoken.sign({
      id: user.id,
      email: user.email,
      role: user.role,
    });
    cookies.set(res, 'token', token);
    logger.info(`User signed in: ${email}`);
    return res.status(200).json({
      message: 'User signed in',
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        role: user.role,
      },
    });
  } catch (error) {
    logger.error('Error in signin:', error);
    return res
      .status(401)
      .json({ error: error.message || 'Invalid credentials' });
  }
};



