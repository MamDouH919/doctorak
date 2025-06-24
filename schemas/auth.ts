import { z } from 'zod';

export const RegisterUserSchema = z.object({
    name: z.string().min(1, "الاسم مطلوب"),
    email: z.string().email("البريد الإلكتروني غير صالح"),
    password: z.string().min(6, "كلمة المرور يجب ألا تقل عن 6 أحرف"),
    specialization: z.string().optional(),
    specialization_needed: z.string().optional(),
}).superRefine((data, ctx) => {
    if (!data.specialization && !data.specialization_needed) {
        ctx.addIssue({
            path: ['specialization'],
            message: "التخصص مطلوب",
            code: z.ZodIssueCode.custom,
        });
    }
});

export const VerifyEmailSchema = z.object({
    email: z.string().email("بريد إلكتروني غير صالح"),
    otp: z.string({ invalid_type_error: 'رمز التحقق مطلوب' }),
});