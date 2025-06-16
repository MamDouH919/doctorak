import { getToken, removeToken } from '@/action/token';
import useDashboard from '@/hooks/useDashboard';
import { useRouter } from 'next/navigation';
import React, { useEffect } from 'react'
import { toast } from 'sonner';

const GetMe = ({ children }: { children: React.ReactNode }) => {
    const context = useDashboard()

    const router = useRouter();

    const GetUser = async () => {
        const token = await getToken()
        const response = await fetch('/api/auth/me', {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
            },
        });
        const data = await response.json();
        if (!data.user) {
            toast.error("الرجاء تسجيل الدخول للمتابعة")
            await removeToken()
            router.push('/login')
        }

        context?.dispatch({ type: "UPDATE_STATE", payload: { user: data.user } });
    }

    useEffect(() => {
        if (!context?.state.user) {
            GetUser()
        }

        return () => { }
    }, [])
    return children
}

export default GetMe