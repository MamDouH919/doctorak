import CardSwap, { Card } from '@/components/CardSwap';
import { Grid, Stack, Typography } from '@mui/material';
import React from 'react';

const ProfileTemplate = () => {
    return (
        <div style={{ height: '600px', position: 'relative', padding: '2rem' }}>
            <Grid container spacing={4} alignItems="center" height="100%">
                {/* Left Side Content */}
                <Grid size={{ xs: 12, sm: 6 }}>
                    <Stack spacing={2}>
                        <Typography variant="h4">Welcome to Your Profile</Typography>
                        <Typography variant="body1">
                            This is a demo profile page with animated card transitions. You can customize
                            this content as needed.
                        </Typography>
                    </Stack>
                </Grid>

                {/* Right Side Card Swap Centered */}
                <Grid size={{ xs: 12, sm: 6 }}>
                    <div
                        style={{
                            display: 'flex',
                            justifyContent: 'center',
                            alignItems: 'center',
                            height: '100%',
                        }}
                    >
                        <CardSwap cardDistance={60} verticalDistance={70} delay={3000} pauseOnHover={true}>
                            <Card>
                                <img
                                    src="https://images.unsplash.com/photo-1526779259212-939e64788e3c?fm=jpg&q=60&w=3000&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8N3x8ZnJlZSUyMGltYWdlc3xlbnwwfHwwfHx8MA%3D%3D"
                                    alt="Card 1"
                                    style={{ width: '100%', borderRadius: '12px', height: '100%' }}
                                />
                            </Card>
                            <Card>
                                <img
                                    src="https://images.unsplash.com/photo-1526779259212-939e64788e3c?fm=jpg&q=60&w=3000&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8N3x8ZnJlZSUyMGltYWdlc3xlbnwwfHwwfHx8MA%3D%3D"
                                    alt="Card 2"
                                    style={{ width: '100%', borderRadius: '12px', height: '100%' }}
                                />
                            </Card>
                            <Card>
                                <img
                                    src="https://images.unsplash.com/photo-1526779259212-939e64788e3c?fm=jpg&q=60&w=3000&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8N3x8ZnJlZSUyMGltYWdlc3xlbnwwfHwwfHx8MA%3D%3D"
                                    alt="Card 3"
                                    style={{ width: '100%', borderRadius: '12px', height: '100%' }}
                                />
                            </Card>
                        </CardSwap>
                    </div>
                </Grid>
            </Grid>
        </div >
    );
};

export default ProfileTemplate;
