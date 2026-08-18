import { z } from "zod";

import { USER_ROLES } from "@/constants/common/user-roles.constant";

import {
  citySchema,
  emailSchema,
  fullNameSchema,
  passwordSchema,
  phoneNumberSchema,
  timezoneSchema,
} from "@/utils";

export const signupSchema = z.object({
  full_name: fullNameSchema,

  email: emailSchema,

  password: passwordSchema,

  city: citySchema,

  phone_number: phoneNumberSchema,

  role: z.enum([USER_ROLES.STUDENT, USER_ROLES.TUTOR]),

  timezone: timezoneSchema.optional(),
});

export const loginSchema = z.object({
  email: emailSchema,

  password: passwordSchema,
});

export const changePasswordSchema = z
  .object({
    current_password: z.string().min(1, "Current password is required"),

    new_password: passwordSchema,

    confirm_password: z.string().min(1, "Password confirmation is required"),
  })
  .refine((data) => data.new_password === data.confirm_password, {
    path: ["confirm_password"],
    message: "Passwords do not match",
  })
  .refine((data) => data.current_password !== data.new_password, {
    path: ["new_password"],
    message: "New password must be different from current password",
  });

export const updateProfileSchema = z
  .object({
    full_name: z
      .string()
      .trim()
      .min(3, "Full name must be at least 3 characters.")
      .max(100, "Full name must not exceed 100 characters.")
      .optional(),

    city: z
      .string()
      .trim()
      .max(100, "City must not exceed 100 characters.")
      .optional(),

    phone_number: z
      .string()
      .trim()
      .max(30, "Phone number must not exceed 30 characters.")
      .optional(),

    timezone: z
      .string()
      .trim()
      .max(100, "Timezone must not exceed 100 characters.")
      .optional(),
  })
  .refine((data) => Object.values(data).some((value) => value !== undefined), {
    message: "At least one field must be updated.",
  });
