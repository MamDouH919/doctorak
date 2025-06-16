import nodemailer from "nodemailer";

export async function OTPEmail(otp: number) {
    const transporter = nodemailer.createTransport({
        service: "Gmail",
        auth: {
            user: process.env.EMAIL_USER!,
            pass: process.env.EMAIL_PASS!,
        },
    });

    await transporter.sendMail({
        to: process.env.EMAIL_USER,
        subject: "Doctorak OTP",
        html: `
    <h2>Doctorak OTP</h2>
    <p>${otp}</p>
  `,
    });
}
