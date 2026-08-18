import { z } from "zod";

import { uuidSchema } from "@/utils";

export const createReviewSchema = z.object({
  booking_id: uuidSchema,

  rating: z
    .number({
      error: "Rating is required.",
    })
    .int()
    .min(1, "Rating must be between 1 and 5.")
    .max(5, "Rating must be between 1 and 5."),

  comment: z
    .string()
    .trim()
    .max(1000, "Comment must not exceed 1000 characters.")
    .optional(),

  review_text: z
    .string()
    .max(1000, "Review text must not exceed 1000 characters.")
    .optional(),
});
