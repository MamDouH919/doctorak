// emails/AccountDeactivatedEmail.tsx
import { Html } from '@react-email/html';
import { Container } from '@react-email/container';
import { Text } from '@react-email/text';
import { Heading } from '@react-email/heading';
import { Section } from '@react-email/section';

type Props = {
    appName: string;
};

export const DeActive = ({ appName }: Props) => {
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
                    <Heading style={{ color: '#f44336' }}>
                        تم تعطيل حسابك على {appName}
                    </Heading>

                    <Text>مرحبًا،</Text>
                    <Text>
                        نأسف لإبلاغك بأنه تم تعطيل حسابك لدينا. إذا كنت تعتقد أن هذا تم عن طريق الخطأ، يرجى التواصل مع فريق الدعم.
                    </Text>
                    <Text style={{ marginTop: '30px' }}>
                        مع تحيات،<br />
                        <strong>فريق {appName}</strong>
                    </Text>
                </Container>
            </Section>
        </Html>
    );
};
