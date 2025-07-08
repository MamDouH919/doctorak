// emails/AccountActivatedEmail.tsx
import { Html } from '@react-email/html';
import { Container } from '@react-email/container';
import { Section } from '@react-email/section';
import { Heading } from '@react-email/heading';
import { Text } from '@react-email/text';

type Props = {
    appName: string; // مثال: "دكاترة"
    lang?: 'ar' | 'en'; // دعم اللغة
};

export const Active = ({ appName, lang = 'ar' }: Props) => {
    const isArabic = lang === 'ar';

    const direction = isArabic ? 'rtl' : 'ltr';
    const textAlign = isArabic ? 'right' : 'left';

    const heading = isArabic
        ? `تم تفعيل حسابك على ${appName}`
        : `Your ${appName} account has been activated`;

    const greeting = isArabic ? 'مرحبًا،' : 'Hello,';

    const message = isArabic
        ? 'نود إبلاغك بأن حسابك قد تم تفعيله بنجاح. يمكنك الآن تسجيل الدخول واستخدام جميع ميزات المنصة.'
        : 'We’re happy to inform you that your account has been successfully activated. You can now log in and start using all the platform features.';

    const thanks = isArabic
        ? `شكراً لاستخدامك ${appName}!`
        : `Thank you for using ${appName}!`;

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
                    <Heading style={{ color: '#4CAF50' }}>{heading}</Heading>
                    <Text>{greeting}</Text>
                    <Text>{message}</Text>
                    <Text style={{ marginTop: '30px' }}>
                        <strong>{thanks}</strong>
                    </Text>
                </Container>
            </Section>
        </Html>
    );
};
