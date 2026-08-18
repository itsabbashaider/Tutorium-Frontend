import { z } from "zod";

import { TEACHING_MODES } from "@/constants/tutor/teaching-mode.constant";

export const updateTutorProfileSchema = z
  .object({
    professional_bio: z
      .string()
      .max(1000, "Professional bio must not exceed 1000 characters.")
      .optional(),

    hourly_rate: z
      .number({
        error: "Hourly rate must be a number.",
      })
      .positive("Hourly rate must be greater than 0.")
      .multipleOf(0.01, "Hourly rate can have at most 2 decimal places.")
      .optional(),

    teaching_mode: z
      .enum([
        TEACHING_MODES.ONLINE,
        TEACHING_MODES.IN_PERSON,
        TEACHING_MODES.BOTH,
      ])
      .optional(),

    is_available: z.boolean().optional(),
  })
  .refine((data) => Object.values(data).some((value) => value !== undefined), {
    message: "At least one field must be updated.",
  });
