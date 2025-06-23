import React from 'react';
import {
    Box,
    Container,
    Typography,
} from '@mui/material';
import { styled } from "@mui/material/styles";
import SearchForDoctors from './SearchForDoctors';

const GradientSection = styled(Box)`
  background: linear-gradient(to bottom right, #fef2f2, #fef2f2);
  padding-top: 4rem;
  padding-bottom: 4rem;

  @media (min-width: 1024px) {
    padding-top: 6rem;
    padding-bottom: 6rem;
  }
`;



interface Props {
    searchInSamePage?: boolean
}

const Banner: React.FC<Props> = () => {
    return (
        <GradientSection>
            <Container maxWidth="lg">
                <Box textAlign="center" mb={6}>
                    <Typography variant="h3" component="h2" fontWeight="bold" color="primary">
                        ابحث عن دكتورك المناسب
                    </Typography>
                    <Typography variant="h6" color="text.secondary">
                        اكتشف أفضل الدكاترة في منطقتك واحجز موعدك بسهولة
                    </Typography>
                </Box>

                <Box maxWidth="md" mx="auto">
                    <SearchForDoctors />
                </Box>
            </Container>
        </GradientSection>
    );
};

export default Banner;
