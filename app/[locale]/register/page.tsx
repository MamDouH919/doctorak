"use client";
import { styled } from "@mui/material/styles";
import {
    Alert,
    Avatar,
    Button,
    Container,
    Divider,
    Grid,
    IconButton,
    Stack,
    Tooltip,
    Typography,
} from "@mui/material";
import { Info, LockOpen, Visibility, VisibilityOff } from "@mui/icons-material";
import { useForm } from "react-hook-form";
import { useTranslation } from "react-i18next";
import { useState } from "react";
import ControlMUITextField from "../../../components/MUI/ControlMUItextField";
import { toast } from "sonner";
import AuthLayout from "@/layouts/auth";
import VerifyCode from "@/components/dialogs/VerifyCode";
import Link from "next/link";
import { useMutation, useQuery } from "@tanstack/react-query";
import { getSpecializations } from "@/lib/api/website";
import ListSpecializations from "@/components/customAutoCompolete/ListSpecializations";
import { register } from "@/lib/api/auth";
import axios from "axios";
import { forEach } from "lodash";
import UploadFile from "@/components/MUI/UploadFile";
// import ListGovernorate from "@/components/customAutoCompolete/ListGovernorate";


const PREFIX = "Login";

const classes = {
    paper: `${PREFIX}-paper`,
    avatar: `${PREFIX}-avatar`,
};

const Root = styled(Stack)(({ theme }) => ({
    margin: theme.spacing(10, 0),

    [`& .${classes.paper}`]: {
        width: "100%",
        padding: theme.spacing(4),
    },
    [`& .${classes.avatar}`]: {
        width: 56,
        height: 56,
        backgroundColor: theme.palette.primary.main,
    },
}));

const Register = () => {
    const { control, handleSubmit, setError, watch, setValue, clearErrors } = useForm({
        mode: "onChange",
    });
    const { t } = useTranslation();
    const [passType, setPassType] = useState("password");
    const [verifyCodeOpen, setVerifyCodeOpen] = useState(false);

    // get specializations
    // const { data: specializations } = useQuery({
    //     queryKey: ['specializations'],
    //     queryFn: () => getSpecializations(),
    // });

    // mutation for register
    const { mutate: registerMutation, isPending: registerLoading } = useMutation({
        mutationFn: (data: {
            name: string,
            email: string,
            password: string,
            phone: string,
            specialization: string,
            specialization_needed: string,
            image: File,
        }) =>
            register(data),
        onError(error) {
            console.log(error);
        }
    });

    const onSubmit = async (data: any) => {
        registerMutation({
            name: data.name,
            email: data.email,
            phone: data.phone,
            password: data.password,
            specialization: data.specialization,
            specialization_needed: data.specialization_needed,
            image: data.image,
        }, {
            onSuccess: () => {
                toast.success(t("website.register.success"))
                setVerifyCodeOpen(true);
                // router.push('/login'); // Redirect to login page after successful registration
            },
            onError(error) {
                if (axios.isAxiosError(error) && error.response?.data?.type === "validation-server") {
                    console.log();
                    error.response.data.errors.forEach((value: any) => {
                        setError(value.field, {
                            type: "validate",
                            message: t("validation." + value.message),
                        });
                    });
                    // console.log(error.);

                    // console.log('errors' in error && error.errors);

                } else {
                    toast.error(t("website.register.error"))
                }
            }
        })
    };

    return (
        <AuthLayout>
            {verifyCodeOpen &&
                <VerifyCode
                    open={verifyCodeOpen}
                    handleClose={() => setVerifyCodeOpen(false)}
                    email={watch('email')} />
            }
            <Container maxWidth={"sm"}>
                <Root spacing={3} alignItems={"center"}>
                    <Stack
                        component={"form"}
                        spacing={2}
                        alignItems={"center"}
                        onSubmit={handleSubmit(onSubmit)}
                        width={"100%"}
                    >
                        <Avatar className={classes.avatar}>
                            <LockOpen fontSize='large' />
                        </Avatar>
                        <Typography variant='h6' fontSize={40}>
                            {t("website.register.title")}
                        </Typography>
                        <Grid container spacing={2} width={"100%"}>
                            <Grid size={{ xs: 12, sm: 6 }}>
                                <ControlMUITextField
                                    control={control}
                                    name='name'
                                    label={t("website.register.name")}
                                    rules={{
                                        required: t("common.required")
                                    }}
                                />
                            </Grid>
                            <Grid size={{ xs: 12, sm: 6 }}>
                                <ControlMUITextField
                                    control={control}
                                    name='phone'
                                    label={t("website.register.phone")}
                                    rules={{
                                        required: t("common.required")
                                    }}
                                />
                            </Grid>
                            <Grid size={{ xs: 12, sm: 6 }}>
                                <ListSpecializations
                                    control={control}
                                    name='specialization'
                                    label={t("website.register.specialization")}
                                    rules={{
                                        required: watch('specialization_needed') ? false : t("common.required")
                                    }}

                                    disabled={!!watch('specialization_needed')}
                                />
                            </Grid>
                            <Grid size={{ xs: 12, sm: 6 }}>
                                <ControlMUITextField
                                    control={control}
                                    name='specialization_needed'
                                    label={t("website.register.specialization_needed")}
                                    disabled={!!watch('specialization')}
                                    onChange={() => {
                                        clearErrors('specialization')
                                    }}
                                    InputProps={{
                                        endAdornment: (
                                            <Tooltip title={t("website.register.specialization_needed_tooltip")}>
                                                <Info />
                                            </Tooltip>
                                        ),
                                    }}
                                />
                            </Grid>
                            <Grid size={{ xs: 12 }}>
                                <ControlMUITextField
                                    control={control}
                                    name='email'
                                    label={t("website.register.email")}
                                    rules={{
                                        required: t("common.required")
                                    }}
                                />
                            </Grid>
                            <Grid size={{ xs: 12 }}>
                                <ControlMUITextField
                                    name='password'
                                    label={t("website.register.password")}
                                    type={passType}
                                    control={control}
                                    rules={{
                                        required: t("common.required")
                                    }}
                                    slotProps={{
                                        input: {
                                            endAdornment: (
                                                <IconButton
                                                    size='small'
                                                    onClick={() =>
                                                        setPassType(
                                                            passType === "password" ? "text" : "password"
                                                        )
                                                    }
                                                >
                                                    {passType === "password" && (
                                                        <VisibilityOff color='primary' fontSize='inherit' />
                                                    )}
                                                    {passType === "text" && (
                                                        <Visibility color='primary' fontSize='inherit' />
                                                    )}
                                                </IconButton>
                                            ),
                                        },
                                    }}
                                />
                            </Grid>
                            <Grid size={{ xs: 12 }}>
                                <UploadFile
                                    control={control}
                                    setValue={setValue}
                                    name="image"
                                    icon={"add_photo_alternate"}
                                    label={t("website.register.specializationCard")}
                                    accept=".png,.jpg,.svg,.jpeg,.webp,.avif"
                                    maxSize={2 * 1024 * 1024}
                                    rules={{
                                        required: t("common.required")
                                    }}
                                />
                            </Grid>
                        </Grid>
                        <Stack width={"100%"} spacing={1}>
                            <Alert severity="warning">
                                {t("website.register.specializationCardWarning")}
                            </Alert>
                            <Alert severity="info">
                                {t("website.register.emailWarning")}
                            </Alert>
                        </Stack>
                        <Button variant='contained' type='submit' fullWidth loading={registerLoading}>
                            {t("website.register.submit")}
                        </Button>
                        {/* divider in middle word or */}
                        <Divider sx={{ margin: theme => theme.spacing(2, 0) }} variant="middle" flexItem>
                            {t("common.or")}
                        </Divider>
                        <Link href="/login" style={{ display: "inline-block", width: "100%" }}>
                            <Button variant='outlined' fullWidth>
                                {t("website.login.title")}
                            </Button>
                        </Link>
                    </Stack>
                </Root>
            </Container>
        </AuthLayout>
    );
};

export default Register;
