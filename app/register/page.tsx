"use client";
import { styled } from "@mui/material/styles";
import {
    Avatar,
    Button,
    Container,
    Divider,
    IconButton,
    Stack,
    Tooltip,
    Typography,
} from "@mui/material";
import { Info, LockOpen, Visibility, VisibilityOff } from "@mui/icons-material";
import { useForm } from "react-hook-form";
import { useTranslation } from "react-i18next";
import { useState } from "react";
import ControlMUITextField from "../../components/MUI/ControlMUItextField";
import { toast } from "sonner";
import AuthLayout from "@/layouts/auth";
import VerifyCode from "@/components/dialogs/VerifyCode";
import Link from "next/link";
import { useQuery } from "@tanstack/react-query";
import { getSpecializations } from "@/lib/api/website";
import ListSpecializations from "@/components/customAutoCompolete/ListSpecializations";
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
    const { control, handleSubmit, setError, watch } = useForm({
        mode: "onChange",
    });
    const { t } = useTranslation();
    const [passType, setPassType] = useState("password");
    const [loading, setLoading] = useState(false);
    const [verifyCodeOpen, setVerifyCodeOpen] = useState(false);

    // get specializations
    const { data: specializations } = useQuery({
        queryKey: ['specializations'],
        queryFn: () => getSpecializations(),
    });

    const onSubmit = async (data: any) => {
        try {
            setLoading(true);
            const response = await fetch('/api/auth/register', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    name: data.name,
                    email: data.email,
                    password: data.password,
                    specialization: data.specialization,
                    specialization_needed: data.specialization_needed,
                }),
            });



            const result = await response.json();
            if (result.typeError === 'validation') {
                if (result.field === 'email') {
                    setError("email", { type: "manual", message: result.message });
                }
                return
            }

            if (response.type === 'error') {
                toast.error(result.message);
            } else {
                toast.success("تم إنشاء حساب بنجاح");
                setVerifyCodeOpen(true);
            }


            // Registration successful
            // router.push('/login'); // Redirect to login page after successful registration
        } catch (err: any) {
        } finally {
            setLoading(false);
        }
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
                        <Typography variant='h1' fontSize={40}>
                            إنشا حساب جديد
                        </Typography>
                        <ControlMUITextField
                            control={control}
                            name='name'
                            label={"الاسم"}
                            rules={{
                                required: "هذا الحقل مطلوب",
                            }}
                        />
                        {/* <ListGovernorate
                            control={control}
                            name='governorate'
                            label={"المحافظة"}
                            rules={{
                                required: "هذا الحقل مطلوب",
                            }}
                        /> */}
                        <ListSpecializations
                            control={control}
                            name='specialization'
                            label={"التخصص"}
                            rules={{
                                required: watch('specialization_needed') ? false : "هذا الحقل مطلوب",
                            }}
                            disabled={!!watch('specialization_needed')}
                        />
                        <ControlMUITextField
                            control={control}
                            name='specialization_needed'
                            label={"التخصص المطلوب"}
                            rules={{
                                required: watch('specialization') ? false : "هذا الحقل مطلوب",
                            }}
                            disabled={!!watch('specialization')}
                            InputProps={{
                                endAdornment: (
                                    <Tooltip title={"إذا لم تجد تخصصك، يمكنك كتابته وسنقوم بإضافته لاحقًا."}>
                                        <Info />
                                    </Tooltip>
                                ),
                            }}
                        />
                        <ControlMUITextField
                            control={control}
                            name='email'
                            label={"البريد الإلكتروني"}
                            rules={{
                                required: "هذا الحقل مطلوب",
                            }}
                        />
                        <ControlMUITextField
                            name='password'
                            label={"كلمة المرور"}
                            type={passType}
                            control={control}
                            rules={{
                                required: "هذا الحقل مطلوب",
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
                        <Button variant='contained' type='submit' fullWidth loading={loading}>
                            إنشاء حساب
                        </Button>
                        {/* divider in middle word or */}
                        <Divider sx={{ margin: theme => theme.spacing(2, 0) }} variant="middle" flexItem>
                            أو
                        </Divider>
                        <Link href="/login" style={{ display: "inline-block", width: "100%" }}>
                            <Button variant='outlined' fullWidth>
                                تسجيل الدخول
                            </Button>
                        </Link>
                    </Stack>
                </Root>
            </Container>
        </AuthLayout>
    );
};

export default Register;
