import {z} from 'zod';

export const signUpSchema = z.object({
    name: z.string().trim().max(255).trim(),
    email: z.email().max(255).toLowerCase().trim(),
    password: z.string().min(6).max(126),
    role: z.enum(['user', 'admin']).default('user')
});


export const signInSchema = z.object({
    email: z.email().toLowerCase().trim(),
    password: z.string().min(1),
});