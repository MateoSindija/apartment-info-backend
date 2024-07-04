import { z } from 'zod';

export const RegisterDTO = z
    .object({
        firstName: z.string().min(3).max(50),
        lastName: z.string().min(3).max(50),
        email: z
            .string()
            .regex(
                new RegExp(
                    /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
                )
            ),
        password: z.string().min(8).max(50),
    })
    .required();

export const LoginDTO = z
    .object({
        email: z
            .string()
            .min(5)
            .max(40)
            .regex(
                new RegExp(
                    /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
                )
            ),
        password: z.string().min(8).max(50),
    })
    .required();

export const InitPasswordResetDTO = z
    .object({
        email: z
            .string()
            .regex(
                new RegExp(
                    /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
                )
            ),
    })
    .required();

export const PasswordResetQueryDTO = z
    .object({
        email: z
            .string()
            .regex(
                new RegExp(
                    /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
                )
            ),
        token: z.string(),
    })
    .required();

export const PasswordResetBodyDTO = z
    .object({
        password: z.string().min(8).max(50),
    })
    .required();

export const VerifyDTO = z
    .object({
        token: z.string(),
    })
    .required();
