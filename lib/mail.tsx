import nodemailer from "nodemailer";
import { render } from '@react-email/render';
import { DeActive } from "@/components/Email/DeActive";
import { Active } from "@/components/Email/Active";
import { OtpEmail } from "@/components/Email/OtpEmail";

export async function OTPEmail(email: string, otp: number, lang: 'ar' | 'en') {
  const transporter = nodemailer.createTransport({
    service: "Gmail",
    auth: {
      user: process.env.EMAIL_USER!,
      pass: process.env.EMAIL_PASS!,
    },
  });

  const htmlOtpEmailPromise = render(<OtpEmail otp={otp} appName="دكاترة" />);
  const subject = lang === 'ar' ? "دكاترة" + " OTP" : "Doctors" + " OTP";
  await transporter.sendMail({
    to: email,
    subject: subject,
    html: await htmlOtpEmailPromise,
  });
}

export async function emailActivation(email: string, active: boolean, lang: 'ar' | 'en' = 'ar') {
  const transporter = nodemailer.createTransport({
    service: "Gmail",
    auth: {
      user: process.env.EMAIL_USER!,
      pass: process.env.EMAIL_PASS!,
    },
  });

  const appName = lang === "ar" ? process.env.NEXT_PUBLIC_APP_NAME_AR! : process.env.NEXT_PUBLIC_APP_NAME_EN!;


  const htmlDeActive = await render(<DeActive appName={appName} lang={lang} />);
  const htmlActive = await render(<Active appName={appName} lang={lang} />);
  // const htmlDeActive = await htmlDeActivePromise;

  const subjectAr = active ? `مرحبًا بك! حسابك على ${appName} تم تفعيله بنجاح` : `حسابك على ${appName} تم تعطيله`;
  const subjectEn = active ? `Welcome! Your account on ${appName} has been activated successfully` : `Your account on ${appName} has been deactivated`;

  await transporter.sendMail({
    to: "mamdouh.mohammed919@gmail.com",
    subject: lang === 'ar' ? subjectAr : subjectEn,
    html: active ? htmlActive : htmlDeActive
  });
}
