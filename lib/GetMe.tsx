import useDashboard from '@/hooks/useDashboard';
import { useQuery } from '@tanstack/react-query';
import React, { useEffect } from 'react'
import { getMe } from './api/auth';

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
        return <div>loading...</div>
    }

    return children
}

export default GetMe