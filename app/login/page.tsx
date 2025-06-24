"use client";
import { styled } from "@mui/material/styles";
import {
    Avatar,
    Button,
    Container,
    Divider,
    IconButton,
    Stack,
    Typography,
} from "@mui/material";
import { LockOpen, Visibility, VisibilityOff } from "@mui/icons-material";
import { useForm } from "react-hook-form";
import { useTranslation } from "react-i18next";
import { useState } from "react";
import ControlMUITextField from "../../components/MUI/ControlMUItextField";
import { toast } from "sonner";
import AuthLayout from "@/layouts/auth";
import Link from "next/link";
import VerifyCode from "@/components/dialogs/VerifyCode";
import { useRouter } from "next/navigation";
import { changeUser } from "@/Store/slices/auth";
import { useAppDispatch } from "@/Store/store";
import { login } from "@/lib/api/auth";
import { useMutation } from "@tanstack/react-query";
import axios from "axios";


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

const Login = () => {
    const { control, handleSubmit, setError, watch } = useForm();
    const { t } = useTranslation();
    const [passType, setPassType] = useState("password");
    const [loading, setLoading] = useState(false);
    const [verifyCodeOpen, setVerifyCodeOpen] = useState(false);
    const dispatch = useAppDispatch();
    const router = useRouter();

    // mutation for login
    const { mutate: loginMutation, isPending: loginLoading } = useMutation({
        mutationFn: (data: { email: string, password: string }) =>
            login(data),
        onError(error) {
            console.log(error);
        }
    });

    const onSubmit = async (data: any) => {
        loginMutation({
            email: data.email,
            password: data.password
        }, {
            onSuccess: async (response) => {
                toast.success("تم تسجيل الدخول بنجاح");
                dispatch(changeUser({
                    id: response.data.user.id,
                    name: response.data.user.name,
                    email: response.data.user.email,
                    role: response.data.user.role,
                    ...(response.data.user.role === "user" && { accountId: response.data.user?.account._id }),
                    isPremium: response.data.user.role === "user" ?
                        response.data.user.account.isPremium : true,
                }));
                router.push('/dashboard')
            },
            onError: async (error) => {
                if (axios.isAxiosError(error) && error.response?.data?.type === "validation-server") {
                    error.response.data.errors.forEach((value: any) => {
                        setError(value.field, {
                            type: "validate",
                            message: value.message,
                        });
                    });
                }
                if (axios.isAxiosError(error) && error.response?.data?.type === "custom") {
                    toast.error(error.response.data.message);
                    setVerifyCodeOpen(true);
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
                    email={watch('email')}
                />
            }
            <Container maxWidth={"sm"}>
                <Root spacing={3} alignItems={"center"}>
                    <Stack
                        component={"form"}
                        spacing={3}
                        alignItems={"center"}
                        onSubmit={handleSubmit(onSubmit)}
                        width={"100%"}
                    >
                        <Avatar className={classes.avatar}>
                            <LockOpen fontSize='large' />
                        </Avatar>
                        <Typography variant='h1' fontSize={40}>
                            تسجيل الدخول
                        </Typography>
                        <ControlMUITextField
                            control={control}
                            name='email'
                            label={"البريد الإلكتروني"}
                            rules={{
                                required: t("auth.fieldIsRequired"),
                            }}
                        />
                        <ControlMUITextField
                            name='password'
                            label={"كلمة المرور"}
                            type={passType}
                            control={control}
                            rules={{
                                required: t("auth.fieldIsRequired"),
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
                        <Button variant='contained' type='submit' fullWidth loading={loginLoading}>
                            تسجيل الدخول
                        </Button>
                        {/* divider in middle word or */}
                        <Divider sx={{ margin: theme => theme.spacing(2, 0) }} variant="middle" flexItem>
                            أو
                        </Divider>
                        {/* need to redirect to register page */}
                        <Link href="/register" style={{ display: "inline-block", width: "100%" }}>
                            <Button variant='outlined' fullWidth>
                                إنشاء حساب
                            </Button>
                        </Link>
                    </Stack>
                </Root>
            </Container>
        </AuthLayout>
    );
};

export default Login;
