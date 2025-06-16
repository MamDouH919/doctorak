"use client"
import * as React from 'react';
import { toast } from 'sonner';
import { getToken } from '@/action/token';
import { CellLink } from '@/components/data-table/CellLink';
import TankStackTable from '@/components/data-table/TankStackTable';

export default function ListUsers() {
    const [loading, setLoading] = React.useState(false)
    const [users, setUsers] = React.useState<any>([])

    const getUsers = async () => {
        setLoading(true)
        const token = await getToken()
        const response = await fetch('/api/users/list', {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
            }
        })
        const result = await response.json();
        if (result.type === 'success') {
            setLoading(false);
            setUsers(result.users);
        } else {
            toast.error("خطأ في الخطأ");
            setLoading(false);
        }
    }
    React.useEffect(() => {
        setLoading(true)
        getUsers()

    }, [])

    const columns = [
        {
            accessorKey: "name",
            header: "اسم المستخدم",
            cell: ({ row }: { row: any }) => (
                <CellLink to={`/dashboard/accounts/${row?.original?._id}`}>
                    {row?.original?.name}
                </CellLink>
            ),
        },
        {
            accessorKey: "email",
            header: "البريد الإلكتروني",
        },
        // {
        //     accessorKey: "role",
        //     header: "الدور",
        //     cell: ({ row }: { row: any }) => (
        //         <CellLink to={`/admin/roles/${row?.original?.role?.id}`}>
        //             {row?.original?.role?.name}
        //         </CellLink>
        //     ),
        // },
        // {
        //     header: "المستخدم مفعل",
        //     cell: ({ row }: { row: any }) => (
        //         <BooleanCell value={row?.original?.user.active} />
        //     ),
        // },
    ];



    return (
        <TankStackTable
            columns={columns}
            data={users as any}
            // paginatorInfo={paginatorInfo as PaginatorInfo}
            loading={loading}
        />
    );
}

// ProductsList.layout = (page: any) => <DashboardLayout children={page} />;