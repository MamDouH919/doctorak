import nodemailer from "nodemailer";
import { render } from '@react-email/render';
import { DeActive } from "@/components/Email/DeActive";
import { Active } from "@/components/Email/Active";
import { OtpEmail } from "@/components/Email/OtpEmail";

export async function OTPEmail(email: string, otp: number) {
  const transporter = nodemailer.createTransport({
    service: "Gmail",
    auth: {
      user: process.env.EMAIL_USER!,
      pass: process.env.EMAIL_PASS!,
    },
  });
  
  const htmlOtpEmailPromise = render(<OtpEmail otp={otp} appName="دكاترة" />);
  await transporter.sendMail({
    to: email,
    subject: "دكاترة" + " OTP",
    html: await htmlOtpEmailPromise,
  });
}

const htmlDeActivePromise = render(<DeActive appName="دكاترة" />);
const htmlActivePromise = render(<Active appName="دكاترة" />);

export async function emailActivation(email: string, active: boolean) {
  const transporter = nodemailer.createTransport({
    service: "Gmail",
    auth: {
      user: process.env.EMAIL_USER!,
      pass: process.env.EMAIL_PASS!,
    },
  });

  const htmlActive = await htmlActivePromise;
  const htmlDeActive = await htmlDeActivePromise;

  await transporter.sendMail({
    to: "mamdouh.mohammed919@gmail.com",
    subject: active ? "مرحبًا بك! حسابك على دكاترة تم تفعيله بنجاح" : "حسابك على دكاترة تم تعطيله",
    html: active ? htmlActive : htmlDeActive
  });
}
