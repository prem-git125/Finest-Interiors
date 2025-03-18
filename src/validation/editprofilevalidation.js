import { z } from 'zod'

export const editSchema = z.object({
    firstName : z.string().min(3,"First-Name Required"),
    lastName : z.string().min(3,"Last-Name Required"),
    email : z.string().email('Invalid Email Format').min(3,"Email Required")
})