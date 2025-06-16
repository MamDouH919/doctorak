import React from 'react';
import {
    Box,
    Container,
    Typography,
    TextField,
    MenuItem,
    Button,
    Paper,
    Grid,
    InputAdornment,
} from '@mui/material';
import SearchIcon from '@mui/icons-material/Search';
import { styled } from "@mui/material/styles";

const GradientSection = styled(Box)`
  background: linear-gradient(to bottom right, #fef2f2, #fef2f2);
  padding-top: 4rem;
  padding-bottom: 4rem;

  @media (min-width: 1024px) {
    padding-top: 6rem;
    padding-bottom: 6rem;
  }
`;

const StyledPaper = styled(Paper)`
  border-radius: 1rem;
  padding: 1.5rem;

  @media (min-width: 1024px) {
    padding: 2rem;
  }
`;

interface Props {
    searchTerm: string;
    setSearchTerm: (val: string) => void;
    selectedSpecialty: string;
    setSelectedSpecialty: (val: string) => void;
    specialties: { name: string }[];
    selectedCity: string;
    setSelectedCity: (val: string) => void;
    cities: string[];
}

const Banner: React.FC<Props> = ({
    searchTerm,
    setSearchTerm,
    selectedSpecialty,
    setSelectedSpecialty,
    specialties,
    selectedCity,
    setSelectedCity,
    cities,
}) => {
    return (
        <GradientSection>
            <Container maxWidth="lg">
                <Box textAlign="center" mb={6}>
                    <Typography variant="h3" component="h2" fontWeight="bold" color="primary">
                        ابحث عن طبيبك المناسب
                    </Typography>
                    <Typography variant="h6" color="text.secondary">
                        اكتشف أفضل الأطباء في منطقتك واحجز موعدك بسهولة
                    </Typography>
                </Box>

                <Box maxWidth="md" mx="auto">
                    <StyledPaper elevation={6}>
                        <Grid container spacing={2}>
                            <Grid size={{ xs: 12, md: 6 }}>
                                <TextField
                                    fullWidth
                                    value={searchTerm}
                                    onChange={(e) => setSearchTerm(e.target.value)}
                                    placeholder="ابحث عن طبيب أو تخصص..."
                                    InputProps={{
                                        endAdornment: (
                                            <InputAdornment position="end">
                                                <SearchIcon sx={{ color: 'gray' }} />
                                            </InputAdornment>
                                        ),
                                    }}
                                    dir="rtl"
                                />
                            </Grid>

                            <Grid size={{ xs: 12, md: 6 }}>
                                <TextField
                                    fullWidth
                                    select
                                    value={selectedSpecialty}
                                    onChange={(e) => setSelectedSpecialty(e.target.value)}
                                    dir="rtl"
                                >
                                    {specialties.map((specialty) => (
                                        <MenuItem key={specialty.name} value={specialty.name}>
                                            {specialty.name}
                                        </MenuItem>
                                    ))}
                                </TextField>
                            </Grid>

                            <Grid size={{ xs: 12, md: 6 }}>
                                <TextField
                                    fullWidth
                                    select
                                    value={selectedCity}
                                    onChange={(e) => setSelectedCity(e.target.value)}
                                    dir="rtl"
                                >
                                    {cities.map((city) => (
                                        <MenuItem key={city} value={city}>
                                            {city}
                                        </MenuItem>
                                    ))}
                                </TextField>
                            </Grid>
                        </Grid>

                        <Box mt={4} textAlign="center">
                            <Button
                                variant="contained"
                                color="primary"
                                startIcon={<SearchIcon />}
                            >
                                بحث
                            </Button>
                        </Box>
                    </StyledPaper>
                </Box>
            </Container>
        </GradientSection>
    );
};

export default Banner;
