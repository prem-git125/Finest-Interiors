import { z } from 'zod'

export const registerSchema = z.object({
    firstName : z.string().min(3,"First-Name Required"),
    lastName : z.string().min(3,"Last-Name Required"),
    email : z.string().email('Invalid Email Format').min(3,"Email Required"),
    password : z.string().min(7,"Password must be of 7 chararcters")
})
