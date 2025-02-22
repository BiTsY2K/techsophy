/**
 * Email Regex:     /^([a-zA-Z0-9_.+-]{1,64})@(?:[a-zA-Z0-9-]{1,63}\.)+[a-zA-Z]{2,}$/
 * Password Regex:  /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[^a-zA-Z0-9]).{8,}$/
 * UUIDv4 Regex:    /^[0-9a-f]{8}-[0-9a-f]{4}-4[0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/)
 */

import { UserRole } from "@prisma/client";
import * as z from "zod";

const emailSchema = z
  .string()
  .trim()
  .min(1, { message: "Email is required." })
  .toLowerCase()
  .email()
  .regex(/^([a-zA-Z0-9_.+-]{1,64})@(?:[a-zA-Z0-9-]{1,63}\.)+[a-zA-Z]{2,}$/, {
    message: "Invalid email. Please enter a valid email address.",
  });

const passwordSchema = z
  .string()
  .min(1, { message: "Password is required." })
  .min(8, { message: "Password must be at least 8 characters long." })
  .max(50, { message: "Password must be at most 50 characters long." })
  .regex(/^(?=.*[a-zA-Z])(?=.*\d)(?=.*[^a-zA-Z0-9]).{1,}$/, {
    message: "Choose a stronger password. Try a mix of letters, numbers and symbols.",
  });

export const ZodSignInSchema = z.object({
  email: emailSchema,
  password: z.string().min(1, { message: "Password is required." }),
  twoFAOtp: z.optional(z.string().regex(/^\d+$/, { message: "Invalid OTP." })),
});

export const ZodSignUpSchema = z
  .object({
    email: emailSchema,
    password: passwordSchema,
    confirmPassword: z.string(),
  })
  .superRefine(({ confirmPassword, password }, ctx) => {
    if (confirmPassword !== password) {
      ctx.addIssue({
        code: "custom",
        message: "Password mismatched. Try again.",
        path: ["confirmPassword"],
      });
    }
  });

export const ZodForgotPasswordSchema = z.object({ email: emailSchema });

export const ZodPasswordResetSchema = z
  .object({
    new_password: passwordSchema,
    confirm_new_password: z.string(),
    token: z
      .string()
      .regex(/^[0-9a-f]{8}-[0-9a-f]{4}-4[0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/)
      .optional(),
  })
  .superRefine(({ new_password, confirm_new_password }, ctx) => {
    if (confirm_new_password !== new_password) {
      ctx.addIssue({
        code: "custom",
        message: "Password mismatched. Try again.",
        path: ["confirm_new_password"],
      });
    }
  });

export const ZodSettingSchema = z
  .object({
    name: z.optional(z.string()),
    email: z.optional(emailSchema),
    password: z.optional(passwordSchema),
    confirmPassword: z.optional(z.string()),
    isTwoFAEnabled: z.optional(z.boolean()),
    role: z.enum([UserRole.ADMIN, UserRole.USER]),
  })
  .superRefine(({ password, confirmPassword }, ctx) => {
    if (password && !confirmPassword) return false;
    if (!password && confirmPassword) return false;
    if (confirmPassword !== password) {
      ctx.addIssue({
        code: "custom",
        message: "Password mismatched. Try again.",
        path: ["confirmPassword"],
      });
    }
  });
