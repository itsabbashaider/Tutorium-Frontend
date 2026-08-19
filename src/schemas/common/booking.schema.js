import { z } from "zod";

import { uuidSchema } from "@/schemas/common/common.schema";

export const createBookingSchema = z.object({
  tutor_profile_id: uuidSchema,

  subject_id: uuidSchema,

  availability_slot_id: uuidSchema,

  booking_date: z.coerce.date().refine(
    (date) => {
      const today = new Date();

      today.setHours(0, 0, 0, 0);

      return date >= today;
    },
    {
      message: "Booking date must be today or a future date.",
    },
  ),

  intro_message: z
    .string()
    .trim()
    .max(500, "Intro message must not exceed 500 characters.")
    .optional(),
});

export const rejectBookingSchema = z.object({
  rejection_reason: z
    .string()
    .trim()
    .min(1, "Rejection reason is required.")
    .max(1000, "Rejection reason must not exceed 1000 characters."),
});
