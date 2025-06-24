import { useQuery } from '@tanstack/react-query';
import React, { useEffect } from 'react'
import { getMe } from './api/auth';
import { CircularProgress, Stack } from '@mui/material';
import { useAppDispatch } from '@/Store/store';
import { changeUser } from '@/Store/slices/auth';

const GetMe = ({ children, token }: { children: React.ReactNode, token?: string | null }) => {
    const { data, isLoading, isError } = useQuery({
        queryKey: ['me', token],
        queryFn: () => getMe(),
        enabled: !!token,
    });

    const dispatch = useAppDispatch();

    useEffect(() => {
        if (data) {
            dispatch(changeUser({
                id: data._id,
                name: data.name,
                email: data.email,
                role: data.role,
                ...(data.role === "user" && { accountId: data?.account._id }),
                isPremium: data.role === "user" ? data.account.isPremium : true,
            }));
            // context?.dispatch({ type: "UPDATE_STATE", payload: { user: data.user } });
        }
        return () => { }
    }, [data])

    if (isLoading) {
        return <Stack height={"100vh"} width={"100vw"} alignItems={"center"} justifyContent={"center"}>
            <CircularProgress />
        </Stack>
    }

    return children
}

export default GetMe