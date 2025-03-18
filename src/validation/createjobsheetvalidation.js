import { z } from "zod";

export const jobsheetSchema = z.object({
  job_sheet_title: z.string().min(1, "Title is required"),
  job_sheet_description: z.string().min(1, "Description is required"),
  from_to: z.string().nonempty("From Date is required"),
  end_at: z.string().nonempty("End Date is required"),
  budget: z
    .number()
    .min(5000, "Budget must be at least 5000")
    .max(100000000, "Budget must not exceed 10 crore"),
});
