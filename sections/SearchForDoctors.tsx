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
    const searchParams = useSearchParams()
    const name = searchParams.get('name')
    const specialty = searchParams.get('specialty')

    const { control, handleSubmit } = useForm({
        defaultValues: {
            name: name ?? '',
            specialty: specialty ?? '',
        },
    })
    const router = useRouter()
    const onSubmit = async (data: any) => {
        if (Object.keys(data).length === 0) {
            return
        }
        const cleaned = Object.fromEntries(
            Object.entries(data)
                .filter(([_, v]) => v !== undefined && v !== '')
                .map(([k, v]) => [k, String(v)])
        );
        const params = new URLSearchParams(cleaned).toString();

        if (searchInSamePage) {
            router.push(`?${params.toString()}`);
        } else {
            router.push(`/doctors?${params}`);
        }
    }
    return (
        <StyledPaper elevation={6}>
            <Grid container spacing={2} component={"form"} onSubmit={handleSubmit(onSubmit)}>
                <Grid size={{ xs: 12 }}>
                    <ControlMUITextField
                        control={control}
                        name='name'
                        label={"اسم الدكتور"}
                        InputProps={{
                            endAdornment: (
                                <InputAdornment position="end">
                                    <SearchIcon sx={{ color: 'gray' }} />
                                </InputAdornment>
                            ),
                        }}
                    />
                </Grid>
                <ListSpecializations
                    control={control}
                    name='specialty'
                    label={"التخصصات"}
                />
                <Grid size={{ xs: 12 }}>
                    <Button
                        type="submit"
                        fullWidth
                        variant="contained"
                        color="primary"
                        startIcon={<SearchIcon />}
                    >
                        بحث
                    </Button>
                </Grid>
            </Grid>


        </StyledPaper>
    )
}

export default SearchForDoctors