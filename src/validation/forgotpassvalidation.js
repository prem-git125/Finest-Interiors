import { z } from 'zod'

export const forgotpassSchema = z.object({
    email: z
        .string({ required_error: 'Email is required' })
        .email('Invalid email')
        .nonempty('Email Required')
})