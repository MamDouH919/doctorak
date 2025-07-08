// emails/OtpEmail.tsx
import { Html } from '@react-email/html';
import { Section } from '@react-email/section';
import { Container } from '@react-email/container';
import { Heading } from '@react-email/heading';
import { Text } from '@react-email/text';

type Props = {
  otp: number | string;
  appName?: string;
  lang?: 'ar' | 'en'; // إضافة اللغة هنا
};

export const OtpEmail = ({ otp, appName = 'دكاترة', lang = 'ar' }: Props) => {
  const isArabic = lang === 'ar';

  const direction = isArabic ? 'rtl' : 'ltr';
  const textAlign = isArabic ? 'right' : 'left';

  const title = isArabic ? `${appName} رمز التحقق` : `${appName} Verification Code`;
  const instruction = isArabic ? 'رمز التحقق الخاص بك هو:' : 'Your verification code is:';
  const note = isArabic ? 'هذا الرمز صالح لفترة محدودة فقط.' : 'This code is only valid for a limited time.';

  return (
    <Html lang={lang} dir={direction}>
      <Section style={{ backgroundColor: '#f8f8f8', padding: '20px' }}>
        <Container
          style={{
            maxWidth: '600px',
            margin: 'auto',
            backgroundColor: '#ffffff',
            borderRadius: '8px',
            padding: '30px',
            boxShadow: '0 0 10px rgba(0,0,0,0.1)',
            fontFamily: 'Arial, sans-serif',
            direction,
            textAlign,
          }}
        >
          <Heading style={{ color: '#333' }}>{title}</Heading>
          <Text>{instruction}</Text>
          <Text
            style={{
              fontSize: '24px',
              fontWeight: 'bold',
              letterSpacing: '4px',
              color: '#4CAF50',
              marginTop: '10px',
            }}
          >
            {otp}
          </Text>
          <Text style={{ marginTop: '20px', fontSize: '12px', color: '#888' }}>
            {note}
          </Text>
        </Container>
      </Section>
    </Html>
  );
};
