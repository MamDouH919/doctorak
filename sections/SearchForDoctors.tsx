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
import { useForm } from 'react-hook-form';
import ControlMUITextField from '@/components/MUI/ControlMUItextField';
import { useRouter, useSearchParams } from 'next/navigation';
import ListSpecializations from '@/components/customAutoCompolete/ListSpecializations';
import ListGovernorate from '@/components/customAutoCompolete/ListGovernorate';
import ListCities from '@/components/customAutoCompolete/ListCities';
import { useTranslation } from 'react-i18next';
import { useLocalizedRouter } from '@/hooks/useLocalizedRouter';


const StyledPaper = styled(Paper)`
  border-radius: 1rem;
  padding: 1.5rem;

  @media (min-width: 1024px) {
    padding: 2rem;
  }
`;

const SearchForDoctors = ({
    searchInSamePage = false,
}: {
    searchInSamePage?: boolean
}) => {
    const { t } = useTranslation()
    const searchParams = useSearchParams()
    const name = searchParams.get('name')
    const specialty = searchParams.get('specialty')
    const governorate = searchParams.get('governorate')
    const city = searchParams.get('city')
    const { push } = useLocalizedRouter();

    const { control, handleSubmit, watch } = useForm({
        defaultValues: {
            name: name ?? '',
            specialty: specialty ?? '',
            governorate: governorate ?? '',
            city: city ?? '',
        },
    })
    const router = useRouter()
    const onSubmit = async (data: any) => {
        const cleaned = Object.fromEntries(
            Object.entries(data)
                .filter(([_, v]) => v !== undefined && v !== '')
                .map(([k, v]) => [k, String(v)])
        );
        if (Object.keys(cleaned).length === 0) {
            return
        }
        const params = new URLSearchParams(cleaned).toString();

        if (searchInSamePage) {
            router.push(`?${params.toString()}`);
        } else {
            push(`doctors?${params}`);
        }
    }
    return (
        <StyledPaper elevation={6}>
            <Grid container spacing={2} component={"form"} onSubmit={handleSubmit(onSubmit)}>
                <Grid size={{ xs: 12 }}>
                    <ControlMUITextField
                        control={control}
                        name='name'
                        label={t("website.searchForDoctors.name")}
                        InputProps={{
                            endAdornment: (
                                <InputAdornment position="end">
                                    <SearchIcon sx={{ color: 'gray' }} />
                                </InputAdornment>
                            ),
                        }}
                    />
                </Grid>
                <Grid size={{ xs: 12 }}>
                    <ListSpecializations
                        control={control}
                        name='specialty'
                        label={t("website.searchForDoctors.specialty")}
                    />
                </Grid>
                <Grid size={{ xs: 12, sm: 6 }}>
                    <ListGovernorate
                        control={control}
                        name='governorate'
                        label={t("website.searchForDoctors.governorate")}
                    />
                </Grid>
                <Grid size={{ xs: 12, sm: 6 }}>
                    <ListCities
                        skip={!watch('governorate')}
                        disabled={!watch('governorate')}
                        governorateId={watch('governorate')}
                        control={control}
                        name='city'
                        label={t("website.searchForDoctors.city")}
                    />
                </Grid>
                <Grid size={{ xs: 12 }}>
                    <Button
                        type="submit"
                        fullWidth
                        variant="contained"
                        color="primary"
                        startIcon={<SearchIcon />}
                    >
                        {t("common.search")}
                    </Button>
                </Grid>
            </Grid>


        </StyledPaper>
    )
}

export default SearchForDoctors