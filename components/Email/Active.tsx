// emails/AccountActivatedEmail.tsx
import { Html } from '@react-email/html';
import { Container } from '@react-email/container';
import { Section } from '@react-email/section';
import { Heading } from '@react-email/heading';
import { Text } from '@react-email/text';

type Props = {
    appName: string; // مثال: "دكاترة"
};

export const Active = ({ appName }: Props) => {
    return (
        <Html lang="ar" dir="rtl">
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
                        direction: 'rtl',
                        textAlign: 'right',
                    }}
                >
                    <Heading style={{ color: '#4CAF50' }}>
                        تم تفعيل حسابك على {appName}
                    </Heading>
                    <Text>مرحبًا،</Text>
                    <Text>
                        نود إبلاغك بأن حسابك قد تم تفعيله بنجاح. يمكنك الآن تسجيل الدخول واستخدام جميع ميزات المنصة.
                    </Text>
                    <Text style={{ marginTop: '30px' }}>
                        شكراً لاستخدامك <strong>{appName}</strong>!
                    </Text>
                </Container>
            </Section>
        </Html>
    );
};
