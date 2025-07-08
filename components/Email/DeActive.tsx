// emails/AccountDeactivatedEmail.tsx
import { Html } from '@react-email/html';
import { Container } from '@react-email/container';
import { Text } from '@react-email/text';
import { Heading } from '@react-email/heading';
import { Section } from '@react-email/section';

type Props = {
    appName: string;
    lang?: 'ar' | 'en'; // دعم اللغة
};

export const DeActive = ({ appName, lang = 'ar' }: Props) => {
    const isArabic = lang === 'ar';

    const direction = isArabic ? 'rtl' : 'ltr';
    const textAlign = isArabic ? 'right' : 'left';

    const heading = isArabic
        ? `تم تعطيل حسابك على ${appName}`
        : `Your ${appName} account has been deactivated`;

    const greeting = isArabic ? 'مرحبًا،' : 'Hello,';

    const message = isArabic
        ? 'نأسف لإبلاغك بأنه تم تعطيل حسابك لدينا. إذا كنت تعتقد أن هذا تم عن طريق الخطأ، يرجى التواصل مع فريق الدعم.'
        : 'We’re sorry to inform you that your account has been deactivated. If you believe this is a mistake, please contact our support team.';

    const closing = isArabic
        ? `مع تحيات،\n\nفريق ${appName}`
        : `Best regards,\n\nThe ${appName} Team`;

    return (
        <Html lang={lang} dir={direction}>
            <Section style={{ backgroundColor: '#f8f8f8', padding: '20px' }}>
                <Container
                    style={{
                        maxWidth: '600px',
                        margin: 'auto',
                        backgroundColor: 'white',
                        borderRadius: '8px',
                        padding: '30px',
                        boxShadow: '0 0 10px rgba(0,0,0,0.1)',
                        fontFamily: 'Arial, sans-serif',
                        direction,
                        textAlign,
                    }}
                >
                    <Heading style={{ color: '#f44336' }}>{heading}</Heading>
                    <Text>{greeting}</Text>
                    <Text>{message}</Text>
                    <Text style={{ marginTop: '30px', whiteSpace: 'pre-line' }}>
                        {closing}
                    </Text>
                </Container>
            </Section>
        </Html>
    );
};
