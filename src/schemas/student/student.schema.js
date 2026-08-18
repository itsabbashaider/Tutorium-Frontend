import { z } from "zod";

export const updateStudentProfileSchema = z
  .object({
    academic_level: z
      .string()
      .max(
        100,
        "Academic level must not exceed 100 characters"
      )
      .optional(),

    learning_goals: z
      .string()
      .max(
        1000,
        "Learning goals must not exceed 1000 characters"
      )
      .optional(),
  })
  .refine(
    (data) =>
      Object.values(data).some(
        (value) =>
          value !== undefined &&
          value !== ""
      ),
    {
      message: "At least one field must be updated",
    }
  );