import { z } from 'zod'

export const designerApprovalSchema = z.object({
    proposal: z.string().min(10,"Description is required"),
    designer_end_date: z.string().nonempty("End date required"),
    designer_budget: z
        .number()
        .min(5000, "Budget must be al least 5,000")
        .max(100000000, "Budget must not exceed 10 crore"),
})