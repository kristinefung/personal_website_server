import { z } from 'zod';

export const userSchema = z.object({
    name: z.string().min(1, "Name is required"),
    email: z.string().email("Invalid email address"),
    password: z.string(),
    password_salt: z.string().nullable().optional(),
    role_id: z.number().nullable().optional(),
    status_id: z.number().nullable().optional(),
    created_by: z.number().nullable().optional(),
    updated_by: z.number().nullable().optional(),
});

export type User = z.infer<typeof userSchema>;