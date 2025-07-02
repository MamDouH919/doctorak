import { z } from 'zod';

const fileSchema = z.instanceof(File, { message: "required" })
const imageSchema = fileSchema.refine(
    file => file.size === 0 || file.type.startsWith("image/")
)

export const RegisterUserSchema = z.object({
    name: z.string().min(1, "required"),
    email: z.string().email("invalidEmail"),
    password: z.string().min(6, "invalidPassword"),
    phone: z.string().min(1, "required"),
    specialization: z.string().optional(),
    specialization_needed: z.string().optional(),
    // 1 mg
    image: imageSchema.refine(file => file.size < 1 * 1024 * 1024 && file.size > 0, "invalidImageSize1mb"),
}).superRefine((data, ctx) => {
    if (!data.specialization && !data.specialization_needed) {
        ctx.addIssue({
            path: ['specialization'],
            message: "required",
            code: z.ZodIssueCode.custom,
        });
    }
});

export const VerifyEmailSchema = z.object({
    email: z.string().email("invalidEmail"),
    otp: z.string({ invalid_type_error: "required" }),
});

export const LoginSchema = z.object({
    email: z.string().email("invalidEmail"),
    password: z.string().min(1, "required"),
});