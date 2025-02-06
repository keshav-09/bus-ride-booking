import * as z from "zod";

export const managerSchema = z.object({
  name: z.string()
    .min(1, "Manager name is required.")
    .regex(/^[a-zA-Z\s]+$/, "Manager name can only contain letters and spaces."),
  email: z.string()
    .email("Invalid email format.")
    .min(1, "Manager email is required.")
});
