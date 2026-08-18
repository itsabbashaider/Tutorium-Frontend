import { z } from "zod";

import { timeSchema } from "@/utils";

export const createAvailabilitySchema = z.object({
  day_of_week: z
    .number({
      error: "Day of week is required",
    })
    .int()
    .min(0, "Day of week must be between 0 and 6")
    .max(6, "Day of week must be between 0 and 6"),

  start_time: timeSchema,

  end_time: timeSchema,

  is_active: z.boolean().optional(),
});

export const updateAvailabilitySchema = z
  .object({
    day_of_week: z
      .number()
      .int()
      .min(0, "Day of week must be between 0 and 6")
      .max(6, "Day of week must be between 0 and 6")
      .optional(),

    start_time: timeSchema.optional(),

    end_time: timeSchema.optional(),

    is_active: z.boolean().optional(),
  })
  .refine((data) => Object.values(data).some((value) => value !== undefined), {
    message: "At least one field must be updated",
  });
