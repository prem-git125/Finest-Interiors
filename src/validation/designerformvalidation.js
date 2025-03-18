import { z } from 'zod';

const fileTypes = ["JPG", "PNG", "PDF", "JPEG"];

export const designerFormSchema = z.object({
  certificateFile: z
    .any()
    .refine((file) => file && fileTypes.includes(file.type.split('/')[1].toUpperCase()), {
      message: "Invalid file type. Only JPG,JPEG,PNG,PDF are allowed.",
    }),
});