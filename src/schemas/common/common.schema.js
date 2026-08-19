import { z } from "zod";

export const emailSchema = z
  .string()
  .trim()
  .min(1, "Email is required")
  .toLowerCase()
  .regex(
    /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/,
    "Please enter a valid email address structure (e.g., name@domain.com)"
  );

export const passwordSchema = z
  .string()
  .min(
    8,
    "Password must be at least 8 characters"
  )
  .max(
    50,
    "Password must not exceed 50 characters"
  )
  .regex(
    /^(?=.*[A-Z])(?=.*[a-z])(?=.*\d).+$/,
    "Password must contain at least 1 uppercase letter, 1 lowercase letter, and 1 number"
  );

export const fullNameSchema = z
  .string()
  .trim()
  .min(
    3,
    "Full name must be at least 3 characters"
  )
  .max(
    50,
    "Full name must not exceed 50 characters"
  );

export const phoneNumberSchema = z
  .string()
  .trim()
  .min(
    1,
    "Phone number is required"
  );

export const citySchema = z
  .string()
  .trim()
  .min(
    1,
    "City is required"
  );

export const timezoneSchema = z
  .string()
  .trim()
  .optional();

export const uuidSchema = z
  .string()
  .regex(
    /^[0-9a-f]{8}-[0-9a-f]{4}-7[0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i,
    "Invalid UUIDv7"
  );

export const timeSchema = z
  .string()
  .regex(
    /^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/,
    "Invalid time format"
  );