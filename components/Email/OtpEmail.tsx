// emails/OtpEmail.tsx
import { Html } from '@react-email/html';
import { Section } from '@react-email/section';
import { Container } from '@react-email/container';
import { Heading } from '@react-email/heading';
import { Text } from '@react-email/text';

type Props = {
  otp: number | string; // يمكن أن يكون otp رقمًا أو سلسلة
  appName?: string; // اختياري، default "دكاترة"
};

export const OtpEmail = ({ otp, appName = 'دكاترة' }: Props) => {
  return (
    <Html lang="ar" dir="rtl">
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
            direction: 'rtl',
            textAlign: 'right',
          }}
        >
          <Heading style={{ color: '#333' }}>{appName} OTP</Heading>
          <Text>رمز التحقق الخاص بك هو:</Text>
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
            هذا الرمز صالح لفترة محدودة فقط.
          </Text>
        </Container>
      </Section>
    </Html>
  );
};
