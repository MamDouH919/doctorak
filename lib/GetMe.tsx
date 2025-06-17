import useDashboard from '@/hooks/useDashboard';
import { useQuery } from '@tanstack/react-query';
import React, { useEffect } from 'react'
import { getMe } from './api/auth';
import { CircularProgress, Stack } from '@mui/material';

const GetMe = ({ children }: { children: React.ReactNode }) => {
    const { data, isLoading, isError } = useQuery({
        queryKey: ['me'],
        queryFn: () => getMe(),
    });
    const context = useDashboard()

    useEffect(() => {
        if (data) {
            context?.dispatch({ type: "UPDATE_STATE", payload: { user: data.user } });
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