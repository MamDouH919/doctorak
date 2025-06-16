"use client"

import React, { useState } from 'react'
import ThemeRegistry from './ThemeRegistry'
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";

const Providers = ({
    children,
}: {
    children: React.ReactNode,
}) => {
    const [queryClient] = useState(() => new QueryClient({
        defaultOptions: {
            queries: {
                staleTime: 0,
                gcTime: 0,
                refetchOnWindowFocus: false,
                refetchOnMount: true,
                retryDelay: 3000,
                retry: (failureCount, error: any) => {
                    if (failureCount >= 2) return false;

                    if (!error?.response) {
                        return true;
                    }

                    const status = error.response?.status;
                    return status !== 400 && status !== 401;
                },
            },
        },
    }));

    const [waiting, setWaiting] = React.useState(true)

    React.useEffect(() => {
        setTimeout(() => {
            setWaiting(false)
        }, 100)
    }, [])

    if (waiting) {
        return
    }

    return (
        <ThemeRegistry>
            <QueryClientProvider client={queryClient}>
                {children}
            </QueryClientProvider>
        </ThemeRegistry>

    )
}

export default Providers