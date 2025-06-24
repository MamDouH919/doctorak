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
import { useMutation, useQuery } from "@tanstack/react-query";
import { getSpecializations } from "@/lib/api/website";
import ListSpecializations from "@/components/customAutoCompolete/ListSpecializations";
import { register } from "@/lib/api/auth";
import axios from "axios";
import { forEach } from "lodash";
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
    const { control, handleSubmit, setError, watch, formState: { errors } } = useForm({
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
        mutationFn: (data: { name: string, email: string, password: string, specialization: string, specialization_needed: string }) =>
            register(data),
        onError(error) {
            console.log(error);
        }
    });

    console.log(errors);


    const onSubmit = async (data: any) => {
        registerMutation({
            name: data.name,
            email: data.email,
            password: data.password,
            specialization: data.specialization,
            specialization_needed: data.specialization_needed,
        }, {
            onSuccess: () => {
                toast.success("تم اضافة الحساب بنجاح");
                setVerifyCodeOpen(true);
                // router.push('/login'); // Redirect to login page after successful registration
            },
            onError(error) {
                if (axios.isAxiosError(error) && error.response?.data?.type === "validation-server") {
                    console.log();
                    error.response.data.errors.forEach((value: any) => {
                        setError(value.field, {
                            type: "validate",
                            message: value.message,
                        });
                    });
                    // console.log(error.);

                    // console.log('errors' in error && error.errors);

                } else {
                    toast.error("حدث خطأ أثناء إضافة الحساب");
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
                        <Button variant='contained' type='submit' fullWidth loading={registerLoading}>
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
