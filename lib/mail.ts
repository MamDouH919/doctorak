import nodemailer from "nodemailer";

export async function OTPEmail(email: string, otp: number) {
    const transporter = nodemailer.createTransport({
        service: "Gmail",
        auth: {
            user: process.env.EMAIL_USER!,
            pass: process.env.EMAIL_PASS!,
        },
    });

    await transporter.sendMail({
        to: email,
        subject: process.env.APP_NAME + " OTP",
        html: `
            <h2>${process.env.APP_NAME}  OTP</h2>
            <p>${otp}</p>
            `,
    });
}
